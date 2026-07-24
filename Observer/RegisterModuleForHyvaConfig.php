<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Observer;

use Magento\Framework\Component\ComponentRegistrar;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class RegisterModuleForHyvaConfig implements ObserverInterface
{
    private const MODULE_NAME = 'FriendsOfHyva_CheckoutExample';

    /**
     * @var ComponentRegistrar
     */
    private $componentRegistrar;

    public function __construct(ComponentRegistrar $componentRegistrar)
    {
        $this->componentRegistrar = $componentRegistrar;
    }

    public function execute(Observer $event)
    {
        $config = $event->getData('config');
        $extensions = $config->hasData('extensions') ? $config->getData('extensions') : [];

        $path = $this->componentRegistrar->getPath(ComponentRegistrar::MODULE, self::MODULE_NAME);
        if (!is_string($path) || $path === '') {
            return;
        }

        $relativePath = $path;
        $basePathPrefix = rtrim(BP, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        if (strpos($path, $basePathPrefix) === 0) {
            $relativePath = substr($path, strlen($basePathPrefix));
        }

        // Only use the path relative to the Magento base dir
        $extensions[] = ['src' => $relativePath];

        $config->setData('extensions', $extensions);
    }
}
