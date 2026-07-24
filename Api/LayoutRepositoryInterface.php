<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Api;

use FriendsOfHyva\CheckoutExample\Api\Data\LayoutInterface;

interface LayoutRepositoryInterface
{
    public function getDraft(int $storeId): LayoutInterface;
    public function getPublished(int $storeId): LayoutInterface;
    public function saveDraft(int $storeId, string $json, int $expectedVersion, ?int $userId = null): LayoutInterface;
    public function publish(int $storeId, int $expectedVersion, ?int $userId = null): LayoutInterface;
}
