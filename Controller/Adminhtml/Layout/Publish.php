<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Controller\Adminhtml\Layout;

use FriendsOfHyva\CheckoutExample\Api\LayoutRepositoryInterface;
use Magento\Backend\App\Action;
use Magento\Backend\Model\Auth\Session;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\Controller\Result\JsonFactory;

class Publish extends AbstractJson implements HttpPostActionInterface
{
    public const ADMIN_RESOURCE = 'FriendsOfHyva_CheckoutExample::checkout_builder_publish';

    public function __construct(
        Action\Context $context,
        JsonFactory $jsonFactory,
        Session $authSession,
        private readonly LayoutRepositoryInterface $repository
    ) {
        parent::__construct($context, $jsonFactory, $authSession);
    }

    public function execute()
    {
        return $this->response(fn() => $this->repository->publish(
            (int)$this->getRequest()->getParam('store_id', 0),
            (int)$this->getRequest()->getParam('version', 0),
            $this->userId()
        )->getData());
    }
}
