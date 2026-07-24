<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Controller\Adminhtml\Editor;

use Magento\Backend\App\Action;
use Magento\Framework\View\Result\PageFactory;

class Index extends Action
{
    public const ADMIN_RESOURCE = 'FriendsOfHyva_CheckoutExample::checkout_builder';

    public function __construct(Action\Context $context, private readonly PageFactory $pageFactory)
    {
        parent::__construct($context);
    }

    public function execute()
    {
        $page = $this->pageFactory->create();
        $page->setActiveMenu(self::ADMIN_RESOURCE);
        $page->getConfig()->getTitle()->prepend(__('Checkout Builder'));
        return $page;
    }
}
