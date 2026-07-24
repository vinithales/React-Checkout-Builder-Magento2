<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Api\Data;

interface LayoutInterface
{
    public const STORE_ID = 'store_id';
    public const JSON = 'json';
    public const VERSION = 'version';
    public const INHERITED = 'inherited';
    public const PUBLISHED = 'published';

    public function getStoreId(): int;
    public function setStoreId(int $storeId): self;
    public function getJson(): string;
    public function setJson(string $json): self;
    public function getVersion(): int;
    public function setVersion(int $version): self;
    public function isInherited(): bool;
    public function setInherited(bool $inherited): self;
    public function isPublished(): bool;
    public function setPublished(bool $published): self;
}
