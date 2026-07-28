<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Test\Unit\Model;

require_once dirname(__DIR__, 3) . '/Model/LayoutValidator.php';
require_once dirname(__DIR__, 3) . '/Model/LayoutContract.php';
require_once dirname(__DIR__, 3) . '/Model/LayoutMigrator.php';

use FriendsOfHyva\CheckoutExample\Model\LayoutContract;
use FriendsOfHyva\CheckoutExample\Model\LayoutMigrator;
use FriendsOfHyva\CheckoutExample\Model\LayoutValidator;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Serialize\Serializer\Json;
use PHPUnit\Framework\TestCase;

class LayoutValidatorTest extends TestCase
{
    private LayoutValidator $validator;

    protected function setUp(): void
    {
        $this->validator = new LayoutValidator(new Json(), new LayoutMigrator());
    }

    public function testLegacyLayoutIsMigratedAndPreservesTree(): void
    {
        $layout = [
            'schemaVersion' => 1,
            'documentName' => 'legacy',
            'root' => [
                'id' => 'root',
                'type' => 'Container',
                'props' => [
                    'direction' => 'row',
                    'gap' => 24,
                    'backgroundColor' => '#ABC',
                    'arbitraryCss' => 'display:none',
                ],
                'children' => [
                    ['id' => 'login', 'type' => 'Login', 'props' => [], 'children' => []],
                    ['id' => 'totals', 'type' => 'Totals', 'props' => [], 'children' => []],
                ],
            ],
        ];

        $migrated = (new Json())->unserialize(
            $this->validator->validate((new Json())->serialize($layout))
        );

        self::assertSame(2, $migrated['schemaVersion']);
        self::assertSame('legacy', $migrated['documentName']);
        self::assertSame('root', $migrated['root']['id']);
        self::assertSame('FlexContainer', $migrated['root']['type']);
        self::assertSame(24, $migrated['root']['props']['gap']);
        self::assertSame('#aabbcc', $migrated['root']['props']['backgroundColor']);
        self::assertArrayNotHasKey('arbitraryCss', $migrated['root']['props']);
        self::assertSame(['login', 'totals'], array_column($migrated['root']['children'], 'id'));
    }

    public function testCurrentFlexAndColumnContainersAreAccepted(): void
    {
        $layout = $this->validLayout();
        $layout['root']['children'][] = [
            'id' => 'column',
            'type' => LayoutContract::COLUMN_CONTAINER,
            'props' => LayoutContract::COLUMN_DEFAULTS,
            'children' => [
                ['id' => 'message', 'type' => 'Message', 'props' => [], 'children' => []],
            ],
        ];

        $validated = (new Json())->unserialize(
            $this->validator->validate((new Json())->serialize($layout))
        );

        self::assertSame($layout, $validated);
    }

    public function testUnknownComponentIsRejected(): void
    {
        $this->expectException(InputException::class);
        $this->validator->validate(
            '{"schemaVersion":2,"root":{"type":"Unknown","props":{},"children":[]}}'
        );
    }

    public function testLeafCannotContainChildren(): void
    {
        $this->expectException(InputException::class);
        $this->validator->validate(
            '{"schemaVersion":2,"root":{"type":"ColumnContainer","props":'
            . json_encode(LayoutContract::COLUMN_DEFAULTS)
            . ',"children":['
            . '{"type":"Login","props":{},"children":['
            . '{"type":"Totals","props":{},"children":[]}]}]}}'
        );
    }

    /**
     * @dataProvider invalidFlexPropsProvider
     */
    public function testInvalidFlexPropertiesAreRejected(callable $mutate): void
    {
        $layout = $this->validLayout();
        $mutate($layout['root']['props']);

        $this->expectException(InputException::class);
        $this->validator->validate((new Json())->serialize($layout));
    }

    public static function invalidFlexPropsProvider(): array
    {
        return [
            'unknown property' => [static function (array &$props): void {
                $props['style'] = 'display:none';
            }],
            'invalid direction' => [static function (array &$props): void {
                $props['direction'] = 'grid';
            }],
            'invalid wrap' => [static function (array &$props): void {
                $props['wrap'] = 'reverse';
            }],
            'invalid justify' => [static function (array &$props): void {
                $props['justifyContent'] = 'baseline';
            }],
            'invalid align' => [static function (array &$props): void {
                $props['alignItems'] = 'baseline';
            }],
            'gap below range' => [static function (array &$props): void {
                $props['gap'] = -1;
            }],
            'gap above range' => [static function (array &$props): void {
                $props['gap'] = 201;
            }],
            'gap string' => [static function (array &$props): void {
                $props['gap'] = '16';
            }],
            'invalid background color' => [static function (array &$props): void {
                $props['backgroundColor'] = 'red';
            }],
            'non-normalized border color' => [static function (array &$props): void {
                $props['borderColor'] = '#ABCDEF';
            }],
            'spacing missing side' => [static function (array &$props): void {
                unset($props['margin']['left']);
            }],
            'spacing unknown side' => [static function (array &$props): void {
                $props['padding']['block'] = 2;
            }],
            'spacing above range' => [static function (array &$props): void {
                $props['padding']['top'] = 301;
            }],
        ];
    }

    public function testColumnRejectsFlexOnlyProperty(): void
    {
        $layout = $this->validLayout(LayoutContract::COLUMN_CONTAINER);
        $layout['root']['props']['direction'] = 'column';

        $this->expectException(InputException::class);
        $this->validator->validate((new Json())->serialize($layout));
    }

    public function testMissingCurrentPropertyReceivesDefault(): void
    {
        $layout = $this->validLayout();
        unset($layout['root']['props']['wrap']);

        $validated = (new Json())->unserialize(
            $this->validator->validate((new Json())->serialize($layout))
        );

        self::assertSame('nowrap', $validated['root']['props']['wrap']);
    }

    public function testNonContainerCannotBeRoot(): void
    {
        $layout = [
            'schemaVersion' => 2,
            'root' => ['type' => 'Login', 'props' => [], 'children' => []],
        ];

        $this->expectException(InputException::class);
        $this->validator->validate((new Json())->serialize($layout));
    }

    public function testEmptyNodeIdIsRejected(): void
    {
        $layout = $this->validLayout();
        $layout['root']['id'] = ' ';

        $this->expectException(InputException::class);
        $this->validator->validate((new Json())->serialize($layout));
    }

    public function testMaximumDepthIsEnforced(): void
    {
        $layout = $this->validLayout(LayoutContract::COLUMN_CONTAINER);
        $cursor = &$layout['root'];
        for ($depth = 0; $depth <= LayoutContract::MAX_DEPTH; $depth++) {
            $cursor['children'][] = [
                'type' => LayoutContract::COLUMN_CONTAINER,
                'props' => LayoutContract::COLUMN_DEFAULTS,
                'children' => [],
            ];
            $cursor = &$cursor['children'][0];
        }
        unset($cursor);

        $this->expectException(InputException::class);
        $this->validator->validate((new Json())->serialize($layout));
    }

    public function testMigrationIsIdempotent(): void
    {
        $legacy = '{"schemaVersion":1,"root":{"id":"root","type":"Container","props":{},'
            . '"children":[{"id":"login","type":"Login","props":{},"children":[]}]}}';
        $once = $this->validator->validate($legacy);

        self::assertSame($once, $this->validator->validate($once));
    }

    /**
     * @return array<string, mixed>
     */
    private function validLayout(string $rootType = LayoutContract::FLEX_CONTAINER): array
    {
        return [
            'schemaVersion' => LayoutContract::CURRENT_SCHEMA_VERSION,
            'root' => [
                'id' => 'root',
                'type' => $rootType,
                'props' => $rootType === LayoutContract::FLEX_CONTAINER
                    ? LayoutContract::FLEX_DEFAULTS
                    : LayoutContract::COLUMN_DEFAULTS,
                'children' => [],
            ],
        ];
    }
}
