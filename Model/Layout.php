<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model;

use Magento\Framework\Model\AbstractModel;

class Layout extends AbstractModel
{
    protected function _construct(): void
    {
        $this->_init(ResourceModel\Layout::class);
    }
}
