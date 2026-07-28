<?php
declare(strict_types=1);

namespace FriendsOfHyva\CheckoutExample\Test\Unit\Model;

require_once dirname(__DIR__, 3) . '/Model/DefaultLayout.php';
require_once dirname(__DIR__, 3) . '/Model/LayoutContract.php';
require_once dirname(__DIR__, 3) . '/Model/LayoutMigrator.php';
require_once dirname(__DIR__, 3) . '/Model/LayoutValidator.php';

use FriendsOfHyva\CheckoutExample\Model\DefaultLayout;
use FriendsOfHyva\CheckoutExample\Model\LayoutContract;
use FriendsOfHyva\CheckoutExample\Model\LayoutMigrator;
use FriendsOfHyva\CheckoutExample\Model\LayoutValidator;
use Magento\Framework\Serialize\Serializer\Json;
use PHPUnit\Framework\TestCase;

class DefaultLayoutTest extends TestCase
{
    public function testDefaultLayoutUsesCurrentSchemaAndPassesValidation(): void
    {
        $jsonSerializer = new Json();
        $json = (new DefaultLayout($jsonSerializer))->getJson();
        $layout = $jsonSerializer->unserialize(
            (new LayoutValidator($jsonSerializer, new LayoutMigrator()))->validate($json)
        );

        self::assertSame(LayoutContract::CURRENT_SCHEMA_VERSION, $layout['schemaVersion']);
        self::assertSame(LayoutContract::COLUMN_CONTAINER, $layout['root']['type']);
        self::assertSame(LayoutContract::COLUMN_DEFAULTS, $layout['root']['props']);
    }
}
