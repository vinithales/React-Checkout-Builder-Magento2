<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model;

use Magento\Framework\Serialize\Serializer\Json;

class DefaultLayout
{
    public function __construct(private readonly Json $json)
    {
    }

    public function getJson(): string
    {
        return $this->json->serialize([
            'schemaVersion' => 1,
            'root' => [
                'type' => 'Container',
                'props' => [],
                'children' => [
                    ['type' => 'Message', 'props' => [], 'children' => []],
                    ['type' => 'Login', 'props' => [], 'children' => []],
                    ['type' => 'AddressWrapper', 'props' => [], 'children' => [
                        ['type' => 'ShippingAddress', 'props' => [], 'children' => []],
                        ['type' => 'BillingAddress', 'props' => [], 'children' => []],
                        ['type' => 'ShippingMethods', 'props' => [], 'children' => []],
                        ['type' => 'PaymentMethod', 'props' => [], 'children' => []],
                        ['type' => 'CheckoutAgreements', 'props' => [], 'children' => []],
                        ['type' => 'CouponCode', 'props' => [], 'children' => []],
                        ['type' => 'PlaceOrder', 'props' => [], 'children' => []],
                    ]],
                    ['type' => 'Totals', 'props' => [], 'children' => []],
                    ['type' => 'StickySidebar', 'props' => [], 'children' => [
                        ['type' => 'CartItems', 'props' => [], 'children' => []],
                    ]],
                ],
            ],
        ]);
    }
}
