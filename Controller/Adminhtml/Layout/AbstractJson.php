<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Controller\Adminhtml\Layout;

use Magento\Backend\App\Action;
use Magento\Backend\Model\Auth\Session;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;

abstract class AbstractJson extends Action
{
    public function __construct(
        Action\Context $context,
        protected readonly JsonFactory $jsonFactory,
        protected readonly Session $authSession
    ) {
        parent::__construct($context);
    }

    protected function response(callable $operation): Json
    {
        $result = $this->jsonFactory->create();
        try {
            return $result->setData(['success' => true, 'layout' => $operation()]);
        } catch (\Exception $exception) {
            return $result->setHttpResponseCode(400)->setData([
                'success' => false,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    protected function userId(): ?int
    {
        $user = $this->authSession->getUser();
        return $user ? (int)$user->getId() : null;
    }
}
