<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Test\Unit\Model;

require_once dirname(__DIR__, 3) . '/Model/LayoutValidator.php';

use FriendsOfHyva\CheckoutExample\Model\LayoutValidator;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Serialize\Serializer\Json;
use PHPUnit\Framework\TestCase;

class LayoutValidatorTest extends TestCase
{
    private LayoutValidator $validator;

    protected function setUp(): void
    {
        $this->validator = new LayoutValidator(new Json());
    }

    public function testValidLayoutIsNormalized(): void
    {
        $json = '{"schemaVersion":1,"root":{"type":"Container","props":{},"children":[]}}';
        self::assertSame($json, $this->validator->validate($json));
    }

    public function testUnknownComponentIsRejected(): void
    {
        $this->expectException(InputException::class);
        $this->validator->validate(
            '{"schemaVersion":1,"root":{"type":"Unknown","props":{},"children":[]}}'
        );
    }

    public function testLeafCannotContainChildren(): void
    {
        $this->expectException(InputException::class);
        $this->validator->validate(
            '{"schemaVersion":1,"root":{"type":"Container","props":{},"children":['
            . '{"type":"Login","props":{},"children":['
            . '{"type":"Totals","props":{},"children":[]}]}]}}'
        );
    }
}
