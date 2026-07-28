<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model;

use Magento\Framework\Exception\InputException;
use Magento\Framework\Serialize\Serializer\Json;

class LayoutValidator
{
    private const SPACING_SIDES = ['top', 'right', 'bottom', 'left'];

    public function __construct(
        private readonly Json $json,
        private readonly LayoutMigrator $migrator
    ) {
    }

    public function validate(string $json): string
    {
        try {
            $layout = $this->json->unserialize($json);
        } catch (\InvalidArgumentException $exception) {
            throw new InputException(__('The layout JSON is invalid.'));
        }
        if (!is_array($layout)) {
            throw new InputException(__('The layout must be a JSON object.'));
        }
        $layout = $this->migrator->migrate($layout);
        $this->validateNode($layout['root'], true, 0);
        return $this->json->serialize($layout);
    }

    private function validateNode(mixed $node, bool $root, int $depth): void
    {
        if ($depth > LayoutContract::MAX_DEPTH) {
            throw new InputException(
                __('The layout exceeds the maximum depth of %1.', LayoutContract::MAX_DEPTH)
            );
        }
        if (!is_array($node) || !is_string($node['type'] ?? null)
            || !in_array($node['type'], LayoutContract::COMPONENTS, true)
            || !is_array($node['props'] ?? null)
            || !is_array($node['children'] ?? null)
        ) {
            throw new InputException(__('The layout contains an invalid node.'));
        }
        if (array_key_exists('id', $node)
            && (!is_string($node['id']) || trim($node['id']) === '')
        ) {
            throw new InputException(__('Layout component IDs must be non-empty strings.'));
        }
        $this->validateProps($node['type'], $node['props']);
        if ($root && !in_array($node['type'], [
            LayoutContract::FLEX_CONTAINER,
            LayoutContract::COLUMN_CONTAINER,
        ], true)) {
            throw new InputException(__('The root layout node must be a FlexContainer or ColumnContainer.'));
        }
        if ($node['children'] !== [] && !in_array($node['type'], LayoutContract::CONTAINERS, true)) {
            throw new InputException(__('Component "%1" cannot contain children.', $node['type']));
        }
        foreach ($node['children'] as $child) {
            $this->validateNode($child, false, $depth + 1);
        }
    }

    /**
     * @param array<string, mixed> $props
     * @throws InputException
     */
    private function validateProps(string $type, array $props): void
    {
        if ($type === LayoutContract::FLEX_CONTAINER) {
            $expected = array_keys(LayoutContract::FLEX_DEFAULTS);
            $this->assertExactProperties($type, $props, $expected);
            $this->assertEnum('direction', $props['direction'], LayoutContract::DIRECTIONS);
            $this->assertEnum('wrap', $props['wrap'], LayoutContract::WRAPS);
            $this->assertEnum('justifyContent', $props['justifyContent'], LayoutContract::JUSTIFY_CONTENT);
            $this->validateSharedProps($props);
            return;
        }

        if ($type === LayoutContract::COLUMN_CONTAINER) {
            $expected = array_keys(LayoutContract::COLUMN_DEFAULTS);
            $this->assertExactProperties($type, $props, $expected);
            $this->validateSharedProps($props);
            return;
        }

        if ($props !== []) {
            throw new InputException(__('Component "%1" contains unsupported properties.', $type));
        }
    }

    /**
     * @param array<string, mixed> $props
     * @param string[] $expected
     */
    private function assertExactProperties(string $type, array $props, array $expected): void
    {
        $received = array_keys($props);
        sort($received);
        sort($expected);
        if ($received !== $expected) {
            throw new InputException(__('Component "%1" contains missing or unsupported properties.', $type));
        }
    }

    /**
     * @param array<string, mixed> $props
     */
    private function validateSharedProps(array $props): void
    {
        $this->assertEnum('alignItems', $props['alignItems'], LayoutContract::ALIGN_ITEMS);
        $this->assertNumber('gap', $props['gap'], 0, 200);
        $this->assertColor('backgroundColor', $props['backgroundColor']);
        $this->assertColor('borderColor', $props['borderColor']);
        $this->assertSpacing('margin', $props['margin']);
        $this->assertSpacing('padding', $props['padding']);
    }

    /**
     * @param string[] $allowed
     */
    private function assertEnum(string $name, mixed $value, array $allowed): void
    {
        if (!is_string($value) || !in_array($value, $allowed, true)) {
            throw new InputException(__('Property "%1" contains an unsupported value.', $name));
        }
    }

    private function assertNumber(string $name, mixed $value, int $min, int $max): void
    {
        if (!is_int($value) && !is_float($value)
            || !is_finite((float)$value)
            || $value < $min
            || $value > $max
        ) {
            throw new InputException(__('Property "%1" must be between %2 and %3.', $name, $min, $max));
        }
    }

    private function assertColor(string $name, mixed $value): void
    {
        if (!is_string($value)
            || ($value !== 'transparent' && preg_match('/^#[0-9a-f]{6}$/', $value) !== 1)
        ) {
            throw new InputException(
                __('Property "%1" must be transparent or a normalized hexadecimal color.', $name)
            );
        }
    }

    private function assertSpacing(string $name, mixed $value): void
    {
        if (!is_array($value)) {
            throw new InputException(__('Property "%1" must contain spacing values.', $name));
        }
        $received = array_keys($value);
        $expected = self::SPACING_SIDES;
        sort($received);
        sort($expected);
        if ($received !== $expected) {
            throw new InputException(__('Property "%1" must define top, right, bottom and left.', $name));
        }
        foreach (self::SPACING_SIDES as $side) {
            $this->assertNumber($name . '.' . $side, $value[$side], 0, 300);
        }
    }
}
