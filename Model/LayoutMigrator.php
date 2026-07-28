<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model;

use Magento\Framework\Exception\InputException;

class LayoutMigrator
{
    /**
     * Convert any supported layout to the current persistent DTO.
     *
     * Document metadata, node IDs, child order and unknown node metadata are
     * preserved. Legacy component properties are reduced to the current
     * whitelist so arbitrary CSS can never cross the persistence boundary.
     *
     * @param array<string, mixed> $layout
     * @return array<string, mixed>
     * @throws InputException
     */
    public function migrate(array $layout): array
    {
        $version = $layout['schemaVersion'] ?? null;
        if (!in_array($version, [
            LayoutContract::LEGACY_SCHEMA_VERSION,
            LayoutContract::CURRENT_SCHEMA_VERSION,
        ], true) || !isset($layout['root'])) {
            throw new InputException(__('The layout has an unsupported schema version or no root node.'));
        }

        $layout['schemaVersion'] = LayoutContract::CURRENT_SCHEMA_VERSION;
        $layout['root'] = $this->migrateNode($layout['root'], (int)$version, 0);

        return $layout;
    }

    /**
     * @return array<string, mixed>
     * @throws InputException
     */
    private function migrateNode(mixed $node, int $sourceVersion, int $depth): array
    {
        if ($depth > LayoutContract::MAX_DEPTH) {
            throw new InputException(
                __('The layout exceeds the maximum depth of %1.', LayoutContract::MAX_DEPTH)
            );
        }
        if (!is_array($node)
            || !is_string($node['type'] ?? null)
            || !is_array($node['props'] ?? null)
            || !is_array($node['children'] ?? null)
        ) {
            throw new InputException(__('The layout contains an invalid node.'));
        }

        $sourceType = $node['type'];
        $type = $sourceType;
        if ($sourceType === LayoutContract::LEGACY_CONTAINER) {
            $type = ($node['props']['direction'] ?? null) === 'row'
                ? LayoutContract::FLEX_CONTAINER
                : LayoutContract::COLUMN_CONTAINER;
        }

        if (!in_array($type, LayoutContract::COMPONENTS, true)) {
            throw new InputException(__('The layout contains an unknown component "%1".', $sourceType));
        }

        if ($sourceVersion === LayoutContract::LEGACY_SCHEMA_VERSION
            || $sourceType === LayoutContract::LEGACY_CONTAINER
        ) {
            $props = $this->normalizeLegacyProps($type, $node['props']);
        } else {
            $props = array_replace($this->defaults($type), $node['props']);
        }

        $children = [];
        foreach ($node['children'] as $child) {
            $children[] = $this->migrateNode($child, $sourceVersion, $depth + 1);
        }

        $node['type'] = $type;
        $node['props'] = $props;
        $node['children'] = $children;

        return $node;
    }

    /**
     * @param array<string, mixed> $props
     * @return array<string, mixed>
     */
    private function normalizeLegacyProps(string $type, array $props): array
    {
        if ($type === LayoutContract::FLEX_CONTAINER) {
            return [
                'direction' => $this->enum(
                    $props['direction'] ?? null,
                    LayoutContract::DIRECTIONS,
                    LayoutContract::FLEX_DEFAULTS['direction']
                ),
                'wrap' => $this->enum(
                    $props['wrap'] ?? null,
                    LayoutContract::WRAPS,
                    LayoutContract::FLEX_DEFAULTS['wrap']
                ),
                'justifyContent' => $this->enum(
                    $props['justifyContent'] ?? null,
                    LayoutContract::JUSTIFY_CONTENT,
                    LayoutContract::FLEX_DEFAULTS['justifyContent']
                ),
                ...$this->normalizeSharedProps($props, LayoutContract::FLEX_DEFAULTS),
            ];
        }

        if ($type === LayoutContract::COLUMN_CONTAINER) {
            return $this->normalizeSharedProps($props, LayoutContract::COLUMN_DEFAULTS);
        }

        return [];
    }

    /**
     * @return array<string, mixed>
     */
    private function defaults(string $type): array
    {
        return match ($type) {
            LayoutContract::FLEX_CONTAINER => LayoutContract::FLEX_DEFAULTS,
            LayoutContract::COLUMN_CONTAINER => LayoutContract::COLUMN_DEFAULTS,
            default => [],
        };
    }

    /**
     * @param array<string, mixed> $props
     * @param array<string, mixed> $defaults
     * @return array<string, mixed>
     */
    private function normalizeSharedProps(array $props, array $defaults): array
    {
        return [
            'alignItems' => $this->enum(
                $props['alignItems'] ?? null,
                LayoutContract::ALIGN_ITEMS,
                $defaults['alignItems']
            ),
            'gap' => $this->number($props['gap'] ?? null, 0, 200, $defaults['gap']),
            'backgroundColor' => $this->color(
                $props['backgroundColor'] ?? null,
                $defaults['backgroundColor']
            ),
            'borderColor' => $this->color(
                $props['borderColor'] ?? null,
                $defaults['borderColor']
            ),
            'margin' => $this->spacing($props['margin'] ?? null, $defaults['margin']),
            'padding' => $this->spacing($props['padding'] ?? null, $defaults['padding']),
        ];
    }

    /**
     * @param string[] $allowed
     */
    private function enum(mixed $value, array $allowed, string $default): string
    {
        return is_string($value) && in_array($value, $allowed, true) ? $value : $default;
    }

    private function number(mixed $value, int $min, int $max, int|float $default): int|float
    {
        if (is_numeric($value)) {
            $number = (float)$value;
            $clamped = min($max, max($min, $number));
            return is_int($value) ? (int)$clamped : $clamped;
        }

        return $default;
    }

    private function color(mixed $value, string $default): string
    {
        if (!is_string($value)) {
            return $default;
        }
        $color = strtolower(trim($value));
        if ($color === 'transparent' || preg_match('/^#[0-9a-f]{6}$/', $color) === 1) {
            return $color;
        }
        if (preg_match('/^#[0-9a-f]{3}$/', $color) === 1) {
            return '#' . implode('', array_map(
                static fn(string $character): string => $character . $character,
                str_split(substr($color, 1))
            ));
        }

        return $default;
    }

    /**
     * @param array<string, int|float> $default
     * @return array<string, int|float>
     */
    private function spacing(mixed $value, array $default): array
    {
        $source = is_array($value) ? $value : [];
        $spacing = [];
        foreach (['top', 'right', 'bottom', 'left'] as $side) {
            $spacing[$side] = $this->number($source[$side] ?? null, 0, 300, $default[$side]);
        }

        return $spacing;
    }
}
