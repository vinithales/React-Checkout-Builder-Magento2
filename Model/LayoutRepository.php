<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Model;

use FriendsOfHyva\CheckoutExample\Api\Data\LayoutInterface;
use FriendsOfHyva\CheckoutExample\Api\Data\LayoutInterfaceFactory;
use FriendsOfHyva\CheckoutExample\Api\LayoutRepositoryInterface;
use FriendsOfHyva\CheckoutExample\Model\ResourceModel\Layout as LayoutResource;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\StateException;
use Magento\Framework\Stdlib\DateTime;
use Magento\Store\Model\StoreManagerInterface;

class LayoutRepository implements LayoutRepositoryInterface
{
    public function __construct(
        private readonly LayoutFactory $layoutFactory,
        private readonly LayoutResource $resource,
        private readonly LayoutInterfaceFactory $dataFactory,
        private readonly LayoutValidator $validator,
        private readonly DefaultLayout $defaultLayout,
        private readonly StoreManagerInterface $storeManager
    ) {
    }

    public function getDraft(int $storeId): LayoutInterface
    {
        $this->assertStore($storeId);
        $model = $this->loadByStore($storeId);
        if ($model->getId() && $model->getData('draft_json')) {
            return $this->makeData($storeId, (string)$model->getData('draft_json'), (int)$model->getData('version'), false, false);
        }
        if ($model->getId() && $model->getData('published_json')) {
            return $this->makeData($storeId, (string)$model->getData('published_json'), (int)$model->getData('version'), false, true);
        }
        $fallback = $storeId === 0 ? null : $this->loadByStore(0);
        if ($fallback && $fallback->getId()) {
            $json = (string)($fallback->getData('draft_json') ?: $fallback->getData('published_json'));
            if ($json !== '') {
                return $this->makeData($storeId, $json, 0, true, (bool)$fallback->getData('published_json'));
            }
        }
        return $this->makeData($storeId, $this->defaultLayout->getJson(), 0, true, false);
    }

    public function getPublished(int $storeId): LayoutInterface
    {
        $this->assertStore($storeId);
        $model = $this->loadByStore($storeId);
        if ($model->getId() && $model->getData('published_json')) {
            return $this->makeData($storeId, (string)$model->getData('published_json'), (int)$model->getData('version'), false, true);
        }
        $fallback = $storeId === 0 ? null : $this->loadByStore(0);
        if ($fallback && $fallback->getId() && $fallback->getData('published_json')) {
            return $this->makeData($storeId, (string)$fallback->getData('published_json'), 0, true, true);
        }
        return $this->makeData($storeId, $this->defaultLayout->getJson(), 0, true, false);
    }

    public function saveDraft(int $storeId, string $json, int $expectedVersion, ?int $userId = null): LayoutInterface
    {
        $this->assertStore($storeId);
        $json = $this->validator->validate($json);
        $model = $this->loadByStore($storeId);
        $currentVersion = $model->getId() ? (int)$model->getData('version') : 0;
        if ($currentVersion !== $expectedVersion) {
            throw new StateException(__('The layout changed since it was loaded. Reload it before saving.'));
        }
        try {
            if ($model->getId()) {
                $affected = $this->resource->getConnection()->update(
                    $this->resource->getMainTable(),
                    [
                        'draft_json' => $json,
                        'version' => $currentVersion + 1,
                        'draft_updated_by' => $userId,
                    ],
                    ['layout_id = ?' => (int)$model->getId(), 'version = ?' => $currentVersion]
                );
                if ($affected !== 1) {
                    throw new StateException(__('The layout changed while it was being saved.'));
                }
            } else {
                $model->setData([
                    'store_id' => $storeId,
                    'draft_json' => $json,
                    'version' => 1,
                    'draft_updated_by' => $userId,
                ]);
                $this->resource->save($model);
            }
        } catch (\Exception $exception) {
            if ($exception instanceof StateException) {
                throw $exception;
            }
            throw new CouldNotSaveException(__('The checkout layout could not be saved.'), $exception);
        }
        return $this->makeData($storeId, $json, $currentVersion + 1, false, false);
    }

    public function publish(int $storeId, int $expectedVersion, ?int $userId = null): LayoutInterface
    {
        $this->assertStore($storeId);
        $model = $this->loadByStore($storeId);
        if (!$model->getId() || !$model->getData('draft_json')) {
            throw new StateException(__('Save a draft before publishing the layout.'));
        }
        $currentVersion = (int)$model->getData('version');
        if ($currentVersion !== $expectedVersion) {
            throw new StateException(__('The layout changed since it was loaded. Reload it before publishing.'));
        }
        $json = $this->validator->validate((string)$model->getData('draft_json'));
        $connection = $this->resource->getConnection();
        $connection->beginTransaction();
        try {
            $affected = $connection->update(
                $this->resource->getMainTable(),
                [
                    'published_json' => $json,
                    'published_by' => $userId,
                    'published_at' => gmdate(DateTime::DATETIME_PHP_FORMAT),
                    'version' => $currentVersion + 1,
                ],
                ['layout_id = ?' => (int)$model->getId(), 'version = ?' => $currentVersion]
            );
            if ($affected !== 1) {
                throw new StateException(__('The layout changed while it was being published.'));
            }
            $connection->commit();
        } catch (\Exception $exception) {
            $connection->rollBack();
            if ($exception instanceof StateException) {
                throw $exception;
            }
            throw new CouldNotSaveException(__('The checkout layout could not be published.'), $exception);
        }
        return $this->makeData($storeId, $json, $currentVersion + 1, false, true);
    }

    private function loadByStore(int $storeId): Layout
    {
        $model = $this->layoutFactory->create();
        $this->resource->load($model, $storeId, 'store_id');
        return $model;
    }

    private function assertStore(int $storeId): void
    {
        if ($storeId < 0 || ($storeId !== 0 && !$this->storeManager->getStore($storeId)->getId())) {
            throw new StateException(__('The requested store view does not exist.'));
        }
    }

    private function makeData(
        int $storeId,
        string $json,
        int $version,
        bool $inherited,
        bool $published
    ): LayoutInterface {
        return $this->dataFactory->create()
            ->setStoreId($storeId)
            ->setJson($json)
            ->setVersion($version)
            ->setInherited($inherited)
            ->setPublished($published);
    }
}
