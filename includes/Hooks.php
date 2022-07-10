<?php
namespace Isekai\OffcanvasToc;

use MediaWiki\MediaWikiServices;
use Html;

class Hooks {
    public static function onLoad(\OutputPage $outputPage) {
		$service = MediaWikiServices::getInstance();
		if (
            $outputPage->getTitle()->isContentPage() &&
            $service->getUserOptionsLookup()->getOption($outputPage->getUser(), 'offcanvas-toc-enabled')
        ) {
            $outputPage->enableOOUI();
            $outputPage->addModules('ext.isekai.offcanvas-toc');
            $outputPage->addModules('oojs-ui.styles.icons-layout');

            $outputPage->addHTML(Html::openElement('div', [
                'id' => 'isekai-offcanvas-toc',
                'class' => 'toc-offcanvas'
            ]) . Html::element('ul') . Html::closeElement('div'));

            $outputPage->addHTML(Html::openElement('button', [
                'id' => 'iseai-offcanvas-btn',
                'class' => 'toc-offcanvas-btn'
            ]) . new \OOUI\IconWidget([
                'icon' => 'menu'
            ]) . Html::closeElement('button'));

            $outputPage->addElement('div', ['id' => 'isekai-offcanvas-cover', 'class' => 'toc-offcanvas-cover']);
        }
    }

    public static function onGetPreferences(\User $user, array &$preferences) {
        $preferences['offcanvas-toc-enabled'] = [
			'type' => 'toggle',
			'label-message' => 'offcanvas-toc-enabled',
			'section' => 'rendering/offcanvas-toc'
		];

        return true;
    }
}