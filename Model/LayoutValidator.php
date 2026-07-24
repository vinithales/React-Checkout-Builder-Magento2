<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model;

use Magento\Framework\Exception\InputException;
use Magento\Framework\Serialize\Serializer\Json;

class LayoutValidator
{
    private const TYPES = [
        'Container', 'AddressWrapper', 'StickySidebar', 'Message', 'PageLoader',
        'Login', 'ShippingAddress', 'BillingAddress', 'ShippingMethods',
        'PaymentMethod', 'CheckoutAgreements', 'CouponCode', 'PlaceOrder',
        'Totals', 'CartItems',
    ];
    private const CONTAINERS = ['Container', 'AddressWrapper', 'StickySidebar'];

    public function __construct(private readonly Json $json)
    {
    }

    public function validate(string $json): string
    {
        try {
            $layout = $this->json->unserialize($json);
        } catch (\InvalidArgumentException $exception) {
            throw new InputException(__('The layout JSON is invalid.'));
        }
        if (!is_array($layout) || ($layout['schemaVersion'] ?? null) !== 1 || !isset($layout['root'])) {
            throw new InputException(__('The layout must contain schemaVersion 1 and a root node.'));
        }
        $this->validateNode($layout['root'], true);
        return $json;
    }

    private function validateNode(mixed $node, bool $root = false): void
    {
        if (!is_array($node) || !is_string($node['type'] ?? null)
            || !in_array($node['type'], self::TYPES, true)
            || !is_array($node['props'] ?? null)
            || !is_array($node['children'] ?? null)
        ) {
            throw new InputException(__('The layout contains an invalid node.'));
        }
        if ($node['props'] !== []) {
            throw new InputException(__('Layout component properties are not supported by schema version 1.'));
        }
        if ($root && $node['type'] !== 'Container') {
            throw new InputException(__('The root layout node must be a Container.'));
        }
        if ($node['children'] !== [] && !in_array($node['type'], self::CONTAINERS, true)) {
            throw new InputException(__('Component "%1" cannot contain children.', $node['type']));
        }
        foreach ($node['children'] as $child) {
            $this->validateNode($child);
        }
    }
}
