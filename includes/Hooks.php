<?php
namespace Isekai\OffcanvasToc;

use Html;

class Hooks {
    public static function onLoad(\OutputPage $outputPage) {
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