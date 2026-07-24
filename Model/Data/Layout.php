<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model\Data;

use FriendsOfHyva\CheckoutExample\Api\Data\LayoutInterface;
use Magento\Framework\DataObject;

class Layout extends DataObject implements LayoutInterface
{
    public function getStoreId(): int { return (int)$this->getData(self::STORE_ID); }
    public function setStoreId(int $storeId): LayoutInterface { return $this->setData(self::STORE_ID, $storeId); }
    public function getJson(): string { return (string)$this->getData(self::JSON); }
    public function setJson(string $json): LayoutInterface { return $this->setData(self::JSON, $json); }
    public function getVersion(): int { return (int)$this->getData(self::VERSION); }
    public function setVersion(int $version): LayoutInterface { return $this->setData(self::VERSION, $version); }
    public function isInherited(): bool { return (bool)$this->getData(self::INHERITED); }
    public function setInherited(bool $inherited): LayoutInterface { return $this->setData(self::INHERITED, $inherited); }
    public function isPublished(): bool { return (bool)$this->getData(self::PUBLISHED); }
    public function setPublished(bool $published): LayoutInterface { return $this->setData(self::PUBLISHED, $published); }
}
