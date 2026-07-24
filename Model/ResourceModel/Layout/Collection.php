<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model\ResourceModel\Layout;

use FriendsOfHyva\CheckoutExample\Model\Layout as LayoutModel;
use FriendsOfHyva\CheckoutExample\Model\ResourceModel\Layout as LayoutResource;
use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{
    protected function _construct(): void
    {
        $this->_init(LayoutModel::class, LayoutResource::class);
    }
}
