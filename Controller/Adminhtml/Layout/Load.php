<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Controller\Adminhtml\Layout;

use FriendsOfHyva\CheckoutExample\Api\LayoutRepositoryInterface;
use Magento\Backend\App\Action;
use Magento\Backend\Model\Auth\Session;
use Magento\Framework\Controller\Result\JsonFactory;

class Load extends AbstractJson
{
    public const ADMIN_RESOURCE = 'FriendsOfHyva_CheckoutExample::checkout_builder';

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
        return $this->response(fn() => $this->repository->getDraft(
            (int)$this->getRequest()->getParam('store_id', 0)
        )->getData());
    }
}
