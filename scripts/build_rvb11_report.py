# -*- coding: utf-8 -*-
"""Отчёт по лабораторной работе № 11 — требования и unit-тесты (БазМет)."""
from docx import Document
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from pathlib import Path

doc = Document()
for section in doc.sections:
    section.top_margin = Cm(2)
    section.bottom_margin = Cm(2)
    section.left_margin = Cm(3)
    section.right_margin = Cm(1.5)


def set_run_font(run, size=14, bold=False, name="Times New Roman"):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    run.bold = bold


def add_para(text, size=14, bold=False, align="justify", first_line=True):
    p = doc.add_paragraph()
    if align == "center":
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif align == "left":
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    else:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = p.paragraph_format
    pf.space_after = Pt(6)
    pf.line_spacing = 1.5
    pf.first_line_indent = Cm(1.25) if (first_line and align == "justify") else Cm(0)
    run = p.add_run(text)
    set_run_font(run, size=size, bold=bold)
    return p


def add_h(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    set_run_font(run, bold=True)
    return p


for line in [
    "МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ",
    "Федеральное государственное автономное образовательное учреждение высшего образования",
    "«Южный федеральный университет» Инженерно-технологическая академия",
    "Институт компьютерных технологий и информационной безопасности",
]:
    add_para(line, align="center", first_line=False, size=12)

add_para("")
add_para("ОТЧЕТ", align="center", bold=True, first_line=False)
add_para("по лабораторной работе № 11", align="center", first_line=False)
add_para("Дисциплина: Разработка Web-приложений", align="center", first_line=False)
add_para(
    "Тема: Описание требований для разработки web-приложения и разработка набора тестов",
    align="center",
    first_line=False,
)
add_para("")
add_para("Выполнил: ст-т группы КТбо3-2 Михайлов М. И.", align="left", first_line=False)
add_para("Преподаватель: ассистент кафедры САиТ Шевцов А. П.", align="left", first_line=False)
doc.add_page_break()

add_h("1. Цель работы")
add_para(
    "Описать требования к web-приложению ООО «БазМет» (клиент React из работ № 6–9), "
    "составить по ним набор тестов, реализовать unit-тесты, выполнить прогон, "
    "зафиксировать дефекты и устранить их."
)

add_h("2. Объект тестирования")
add_para(
    "Клиентская часть каталога и формы заявки: /Users/maksim/Documents/react. "
    "Каталог загружается из Strapi (работа № 9), заявки уходят в Express API "
    "(работы № 7–8). Для unit-тестов выделены чистые функции без браузера: "
    "src/utils/orderValidation.js и src/utils/catalogHelpers.js."
)

add_h("3. Требования к системе")
add_para("R1. Пользователь может искать изделия в каталоге по подстроке названия.")
add_para("R2. Ссылка на карточку товара использует стабильный идентификатор (documentId или латинский sku).")
add_para("R3. Форма заявки не принимает пустое или слишком короткое имя.")
add_para("R4. Телефон в заявке должен быть полным номером РФ (11 цифр с кодом 7).")
add_para("R5. E-mail в заявке должен быть корректного формата.")
add_para("R6. Каталог можно сузить фильтрами: тип метиза, стандарт, материал.")
add_para("R7. Некорректные поля формы показывают понятное сообщение об ошибке (не пустой submit).")

add_h("4. Набор тестов (фрагмент)")
add_para(
    "TC-01 (R3): имя пустое → errorFor возвращает «Заполните имя.» "
    "TC-02 (R3): имя «Иван» → ошибки нет. "
    "TC-03 (R4): телефон «+7 (999)» → ошибка неполного номера. "
    "TC-04 (R4): полный номер → ошибки нет. "
    "TC-05 (R5): email «not-mail» → ошибка формата. "
    "TC-06 (R1): filterProducts с q=«гайка» → одна запись. "
    "TC-07 (R6): type=nut → только гайки. "
    "TC-08 (R2): productRouteId с documentId → в URL идёт documentId."
)

add_h("5. Unit-тестирование")
add_para(
    "Инструмент: Vitest (совместим с Vite). Команда прогона: "
    "cd /Users/maksim/Documents/react && npm test. "
    "Файлы: src/utils/orderValidation.test.js, src/utils/catalogHelpers.test.js."
)
add_para(
    "Прогон фиксирует успешное выполнение всех тест-кейсов (зелёный отчёт в терминале). "
    "Это и есть наглядная демонстрация работы № 11 на защите."
)

add_h("6. Обнаруженные дефекты и исправления")
add_para(
    "Д1. Логика проверки заявки была «зашита» внутри React-компонента Order.jsx — "
    "её нельзя было вызвать из unit-теста. Исправление: вынесена в orderValidation.js, "
    "компонент импортирует те же функции."
)
add_para(
    "Д2. Битый sku с символами % ломал URL карточки (работа № 10 / каталог). "
    "Исправление: productRouteId предпочитает documentId; покрыто тестом TC-08."
)

add_h("7. Ответы на вопросы темы")
add_para(
    "Виды тестирования: модульное (unit), интеграционное, системное, приёмочное; "
    "по знанию кода — white/black/grey box; по цели — функциональное, регрессионное, "
    "нагрузочное, usability. В работе выполнен unit-уровень по функциональным требованиям."
)
add_para(
    "Обнаружение дефектов: тест падает (assert) → фиксируется в журнале → правится код → "
    "повторный прогон. Описание требований должно быть проверяемым (можно написать тест)."
)

add_h("8. Запуск")
add_para(
    "cd /Users/maksim/Documents/react && npm install && npm test. "
    "Ожидаемый результат: Vitest сообщает об успешном прохождении тестов."
)

add_h("9. Заключение")
add_para(
    "Для БазМет сформулированы требования R1–R7, составлен набор тестов, реализованы "
    "и прогнаны unit-тесты Vitest. Дефекты, мешавшие тестированию и стабильным URL, "
    "устранены. Работа № 11 выполнена."
)

out = Path("/Users/maksim/Documents/РВБ-11.docx")
doc.save(out)
print("saved", out)
old = Path("/Users/maksim/Documents/РВБ-11.doc")
if old.exists():
    old.unlink()
    print("removed", old)
