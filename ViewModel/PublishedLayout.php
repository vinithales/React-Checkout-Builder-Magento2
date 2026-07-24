<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\ViewModel;

use FriendsOfHyva\CheckoutExample\Api\LayoutRepositoryInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Store\Model\StoreManagerInterface;

class PublishedLayout implements ArgumentInterface
{
    public function __construct(
        private readonly LayoutRepositoryInterface $repository,
        private readonly StoreManagerInterface $storeManager
    ) {
    }

    public function getJson(): string
    {
        return $this->repository->getPublished((int)$this->storeManager->getStore()->getId())->getJson();
    }
}
