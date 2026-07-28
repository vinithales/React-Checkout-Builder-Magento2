<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model;

final class LayoutContract
{
    public const CURRENT_SCHEMA_VERSION = 2;
    public const LEGACY_SCHEMA_VERSION = 1;
    public const MAX_DEPTH = 100;

    public const FLEX_CONTAINER = 'FlexContainer';
    public const COLUMN_CONTAINER = 'ColumnContainer';
    public const LEGACY_CONTAINER = 'Container';

    public const COMPONENTS = [
        self::FLEX_CONTAINER,
        self::COLUMN_CONTAINER,
        'AddressWrapper',
        'StickySidebar',
        'Message',
        'PageLoader',
        'Login',
        'ShippingAddress',
        'BillingAddress',
        'ShippingMethods',
        'PaymentMethod',
        'CheckoutAgreements',
        'CouponCode',
        'PlaceOrder',
        'Totals',
        'CartItems',
    ];

    public const CONTAINERS = [
        self::FLEX_CONTAINER,
        self::COLUMN_CONTAINER,
        'AddressWrapper',
        'StickySidebar',
    ];

    public const FLEX_DEFAULTS = [
        'direction' => 'row',
        'wrap' => 'nowrap',
        'justifyContent' => 'flex-start',
        'alignItems' => 'stretch',
        'gap' => 16,
        'backgroundColor' => 'transparent',
        'borderColor' => 'transparent',
        'margin' => ['top' => 0, 'right' => 0, 'bottom' => 0, 'left' => 0],
        'padding' => ['top' => 16, 'right' => 16, 'bottom' => 16, 'left' => 16],
    ];

    public const COLUMN_DEFAULTS = [
        'alignItems' => 'stretch',
        'gap' => 16,
        'backgroundColor' => 'transparent',
        'borderColor' => 'transparent',
        'margin' => ['top' => 0, 'right' => 0, 'bottom' => 0, 'left' => 0],
        'padding' => ['top' => 16, 'right' => 16, 'bottom' => 16, 'left' => 16],
    ];

    public const ALIGN_ITEMS = ['stretch', 'flex-start', 'center', 'flex-end'];
    public const DIRECTIONS = ['row', 'column'];
    public const WRAPS = ['nowrap', 'wrap'];
    public const JUSTIFY_CONTENT = [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
    ];

    private function __construct()
    {
    }
}
