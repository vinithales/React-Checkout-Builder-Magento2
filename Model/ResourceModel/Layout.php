<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Layout extends AbstractDb
{
    protected function _construct(): void
    {
        $this->_init('hyva_checkout_builder_layout', 'layout_id');
    }
}
