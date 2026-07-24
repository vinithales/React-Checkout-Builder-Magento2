<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\ViewModel;

use Magento\Backend\Model\UrlInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Data\Form\FormKey;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Store\Model\StoreManagerInterface;

class EditorConfig implements ArgumentInterface
{
    public function __construct(
        private readonly UrlInterface $url,
        private readonly FormKey $formKey,
        private readonly StoreManagerInterface $storeManager,
        private readonly Json $json,
        private readonly RequestInterface $request
    ) {
    }

    public function getJson(): string
    {
        $defaultStore = $this->storeManager->getDefaultStoreView();
        $stores = [[
            'value' => 0,
            'label' => (string)__('Default configuration'),
            'checkoutUrl' => rtrim((string)$defaultStore->getBaseUrl(), '/') . '/checkout',
        ]];
        foreach ($this->storeManager->getStores() as $store) {
            $stores[] = [
                'value' => (int)$store->getId(),
                'label' => sprintf(
                    '%s — %s',
                    $store->getWebsite()->getName(),
                    $store->getName()
                ),
                'checkoutUrl' => rtrim((string)$store->getBaseUrl(), '/') . '/checkout',
            ];
        }
        return $this->json->serialize([
            'formKey' => $this->formKey->getFormKey(),
            'storeId' => (int)$this->request->getParam('store', 0),
            'stores' => $stores,
            'urls' => [
                'load' => $this->url->getUrl('hyva_checkout_builder/layout/load'),
                'save' => $this->url->getUrl('hyva_checkout_builder/layout/save'),
                'publish' => $this->url->getUrl('hyva_checkout_builder/layout/publish'),
            ],
        ]);
    }
}
