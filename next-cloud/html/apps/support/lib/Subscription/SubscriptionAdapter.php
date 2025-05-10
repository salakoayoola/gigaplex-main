<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Support\Subscription;

use OCA\Support\Service\SubscriptionService;
use OCP\AppFramework\Services\IAppConfig;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IConfig;
use OCP\Support\Subscription\ISubscription;
use OCP\Support\Subscription\ISupportedApps;

class SubscriptionAdapter implements ISubscription, ISupportedApps {
	public function __construct(
		private readonly SubscriptionService $subscriptionService,
		private readonly IConfig $config,
		private readonly IAppConfig $appConfig,
		private readonly ITimeFactory $timeFactory,
	) {
	}

	/**
	 * Indicates if a valid subscription is available
	 */
	public function hasValidSubscription(): bool {
		try {
			$endDate = $this->appConfig->getAppValueString('end_date');
		} catch (\Throwable) {
			return false;
		}

		return $this->subscriptionNotExpired($endDate);
	}

	private function subscriptionNotExpired(string $endDate): bool {
		if ($endDate === '' || $endDate === 'now') {
			return false;
		}

		$subscriptionEndDate = $this->timeFactory->getDateTime($endDate);
		$now = $this->timeFactory->getDateTime();
		return $now < $subscriptionEndDate;
	}

	/**
	 * Fetches the list of app IDs that are supported by the subscription
	 *
	 * @since 17.0.0
	 */
	public function getSupportedApps(): array {
		[
			$instanceSize,
			$hasSubscription,
			$isInvalidSubscription,
			$isOverLimit,
			$subscriptionInfo
		] = $this->subscriptionService->getSubscriptionInfo();
		$hasValidGroupwareSubscription = $this->subscriptionNotExpired($subscriptionInfo['groupware']['endDate'] ?? 'now');
		$hasValidTalkSubscription = $this->subscriptionNotExpired($subscriptionInfo['talk']['endDate'] ?? 'now');
		$hasValidCollaboraSubscription = $this->subscriptionNotExpired($subscriptionInfo['collabora']['endDate'] ?? 'now');
		$hasValidOnlyOfficeSubscription = $this->subscriptionNotExpired($subscriptionInfo['onlyoffice']['endDate'] ?? 'now');

		$filesSubscription = [
			'activity',
			'admin_audit',
			'bruteforcesettings',
			'circles',
			'cloud_federation_api',
			'comments',
			'data_request',
			'dav',
			'encryption',
			'external',
			'federatedfilesharing',
			'federation',
			'files',
			'files_accesscontrol',
			'files_antivirus',
			'files_automatedtagging',
			'files_external',
			'files_fulltextsearch',
			'files_fulltextsearch_tesseract',
			'files_pdfviewer',
			'files_retention',
			'files_sharing',
			'files_trashbin',
			'files_versions',
			'firstrunwizard',
			'fulltextsearch',
			'fulltextsearch_elasticsearch',
			'groupfolders',
			'guests',
			'logreader',
			'lookup_server_connector',
			'nextcloud_announcements',
			'notifications',
			'oauth2',
			'password_policy',
			'photos',
			'privacy',
			'provisioning_api',
			'recommendations',
			'serverinfo',
			'settings',
			'sharebymail',
			'sharepoint',
			'socialsharing_diaspora',
			'socialsharing_email',
			'socialsharing_facebook',
			'socialsharing_twitter',
			'support',
			'survey_client',
			'suspicious_login',
			'systemtags',
			'terms_of_service',
			'text',
			'theming',
			'twofactor_backupcodes',
			'twofactor_totp',
			'updatenotification',
			'user_ldap',
			'user_oidc',
			'user_saml',
			'viewer',
			'workflowengine',
			'workflow_script',
		];

		$nextcloudVersion = \OCP\Util::getVersion()[0];

		if ($nextcloudVersion >= 30) {
			$filesSubscription[] = 'app_api';
			$filesSubscription[] = 'twofactor_nextcloud_notification';
			if (($subscriptionInfo['level'] ?? 'none') === 'ultimate') {
				$filesSubscription[] = 'webhook_listeners';
			}
		}

		if ($nextcloudVersion >= 29) {
			$filesSubscription[] = 'files_downloadlimit';
			$filesSubscription[] = 'files_reminders';
		}

		if ($nextcloudVersion >= 28) {
			$filesSubscription[] = 'files_reminders';
			$filesSubscription[] = 'security_guard';
		} else {
			// Removed in 28
			$filesSubscription[] = 'files_rightclick';
		}

		if ($nextcloudVersion >= 26) {
			$filesSubscription[] = 'files_confidential';
		}

		if ($nextcloudVersion >= 25) {
			$filesSubscription[] = 'related_resources';
		} else {
			// Removed in 25
			$filesSubscription[] = 'files_videoplayer';
		}

		if ($nextcloudVersion >= 24) {
			$filesSubscription[] = 'files_lock';
		}

		if ($nextcloudVersion >= 22) {
			$filesSubscription[] = 'approval';
			$filesSubscription[] = 'contacts';
			$filesSubscription[] = 'files_zip';
		}

		if ($nextcloudVersion >= 20) {
			$filesSubscription[] = 'dashboard';
			$filesSubscription[] = 'flow_notifications';
			$filesSubscription[] = 'user_status';
			$filesSubscription[] = 'weather_status';
		}

		if ($nextcloudVersion >= 19) {
			$filesSubscription[] = 'contactsinteraction';
		}

		if ($nextcloudVersion >= 18) {
			$filesSubscription[] = 'globalsiteselector';
		}

		$supportedApps = [];

		if ($hasSubscription) {
			$supportedApps = array_merge($supportedApps, $filesSubscription);
		}
		if ($hasValidGroupwareSubscription) {
			$supportedApps[] = 'calendar';
			$supportedApps[] = 'contacts';
			$supportedApps[] = 'deck';
			$supportedApps[] = 'mail';
		}
		if ($hasValidTalkSubscription) {
			$supportedApps[] = 'spreed';
		}
		if ($hasValidCollaboraSubscription) {
			$supportedApps[] = 'richdocuments';
		}
		if ($hasValidOnlyOfficeSubscription) {
			$supportedApps[] = 'onlyoffice';
		}

		if (isset($subscriptionInfo['supportedApps'])) {
			foreach ($subscriptionInfo['supportedApps'] as $app) {
				if ($app !== '' && !in_array($app, $supportedApps)) {
					$supportedApps[] = $app;
				}
			}
		}

		return $supportedApps;
	}

	/**
	 * Indicates if the subscription has extended support
	 *
	 * @since 17.0.0
	 */
	public function hasExtendedSupport(): bool {
		try {
			return $this->appConfig->getAppValueBool('extended_support');
		} catch (\Throwable) {
			return false;
		}
	}

	/**
	 * Indicates if a hard user limit is reached and no new users should be created
	 *
	 * @since 21.0.0
	 */
	public function isHardUserLimitReached(): bool {
		[
			,,
			$isInvalidSubscription,
			$isOverLimit,
			$subscriptionInfo
		] = $this->subscriptionService->getSubscriptionInfo();

		$configUserLimit = (int)$this->config->getAppValue('support', 'user-limit', '0');
		if (
			!$isInvalidSubscription
			&& $configUserLimit > 0
			&& $configUserLimit <= $this->subscriptionService->getUserCount()
		) {
			return true;
		}

		if (!isset($subscriptionInfo['hasHardUserLimit']) || $subscriptionInfo['hasHardUserLimit'] === false) {
			return false;
		}

		return $isOverLimit;
	}
}
