#!/usr/bin/env python3
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
import os

doc = Document()
section = doc.sections[0]
section.page_width = Cm(21.0)
section.page_height = Cm(29.7)
section.left_margin = Cm(2.5)
section.right_margin = Cm(1.5)
section.top_margin = Cm(2.0)
section.bottom_margin = Cm(2.0)

def font_run(run, size=14, bold=False):
    run.bold = bold
    run.font.name = "Times New Roman"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor(0, 0, 0)

def add_p(text="", *, size=14, bold=False, center=False, indent=True, space_after=6, space_before=0):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = p.paragraph_format
    pf.space_after = Pt(space_after)
    pf.space_before = Pt(space_before)
    pf.line_spacing = 1.15
    pf.first_line_indent = Cm(1.25) if indent and not center and text else Cm(0)
    if text:
        font_run(p.add_run(text), size=size, bold=bold)
    return p

def add_heading_line(text):
    return add_p(text, size=14, bold=True, indent=False, space_before=12, space_after=6)

def shade_cell(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), hex_color)
    shd.set(qn("w:val"), "clear")
    tcPr.append(shd)

def set_cell(cell, text, *, bold=False, size=11):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.space_before = Pt(2)
    font_run(p.add_run(text), size=size, bold=bold)

def add_table(headers, rows, col_widths):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, header in enumerate(headers):
        set_cell(table.rows[0].cells[i], header, bold=True)
        shade_cell(table.rows[0].cells[i], "E6E6E6")
    for r, row in enumerate(rows):
        for c, value in enumerate(row):
            set_cell(table.rows[r + 1].cells[c], value)
    for row in table.rows:
        for i, width in enumerate(col_widths):
            row.cells[i].width = Cm(width)
    return table

def add_code(text):
    p = add_p(text, size=11, indent=False, space_after=2)
    for run in p.runs:
        run.font.name = "Courier New"
        run._element.rPr.rFonts.set(qn("w:eastAsia"), "Courier New")

for line in [
    "МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ",
    "Федеральное государственное автономное образовательное учреждение высшего образования",
    "«Южный федеральный университет»",
    "Инженерно-технологическая академия",
    "Институт компьютерных технологий и информационной безопасности",
]:
    add_p(line, size=12, center=True, indent=False, space_after=2)

add_p("", size=12, center=True, indent=False, space_after=18)
add_p("ОТЧЕТ", size=16, bold=True, center=True, indent=False, space_after=6)
add_p("по лабораторной работе № 13", size=14, center=True, indent=False, space_after=2)
add_p("Дисциплина: Разработка Web-приложений", size=14, center=True, indent=False, space_after=2)
add_p("Тема: Развёртывание web-приложения", size=14, center=True, indent=False, space_after=18)
add_p("Выполнил: ст-т группы КТбо3-2 Михайлов М. И.", size=14, indent=False, space_after=2)
p = add_p("", size=14, indent=False, space_after=2)
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
font_run(p.add_run("Преподаватель: ассистент кафедры САиТ Шевцов А. П."), size=14)
add_p("", size=14, center=True, indent=False, space_after=120)
add_p("Таганрог", size=14, center=True, indent=False, space_after=0)
add_p("2026", size=14, center=True, indent=False, space_after=0)
doc.add_page_break()

add_heading_line("1. Цель работы")
add_p("Собрать web-приложение ООО «БазМет» в Docker-контейнеры, поднять его вместе с PostgreSQL одной командой docker compose, описать запуск с нуля на другой машине и проверить инструкцию на практике.")

add_heading_line("2. Объект развёртывания")
add_p("Клиент React (/Users/maksim/Documents/react) и API Express + PostgreSQL (/Users/maksim/Documents/database). CMS Strapi в состав Docker-стека не входит: для задания достаточно клиента, API и базы; каталог отдаётся из PostgreSQL через Express (как в работах № 7–8).")

add_heading_line("3. Архитектура контейнеров")
add_p("Три сервиса в docker-compose.yml:")
add_table(
    ["Сервис", "Образ / сборка", "Назначение"],
    [
        ["db", "postgres:16-alpine", "БД bazmet и bazmet_orders, volume pgdata"],
        ["api", "database/Dockerfile", "Express, seed при первом старте, порт 3001 внутри сети"],
        ["web", "react/Dockerfile", "Сборка Vite → Nginx, порт хоста 8080→80"],
    ],
    [2.8, 4.5, 8.5],
)
add_p("Браузер открывает только web. Nginx отдаёт статику React и проксирует /api и /images на api. API ждёт здоровый db (healthcheck pg_isready), web ждёт здоровый api.", space_before=8)

add_heading_line("4. Что сделано в файлах")
add_p("react/docker-compose.yml — описание стека db + api + web.", indent=False)
add_p("react/Dockerfile — multi-stage: npm ci + vite build, затем nginx:alpine со статикой.", indent=False)
add_p("react/nginx.conf — try_files для SPA, proxy_pass на api:3001 для /api и /images.", indent=False)
add_p("database/Dockerfile — Node 20 Alpine, non-root пользователь, entrypoint со seed.", indent=False)
add_p("database/scripts/docker-entrypoint.sh — ждёт Postgres, при пустом каталоге вызывает seed, затем стартует API.", indent=False)
add_p("database/docker/init/01-create-orders-db.sh — создаёт БД bazmet_orders при первом запуске Postgres.", indent=False)
add_p("react/src/api.js — клиент снова ходит в Express /api (без Strapi), чтобы Docker работал без CMS.", indent=False)
add_p("database/src/index.js — слушает HOST=0.0.0.0 (иначе из контейнера API недоступен).", indent=False)
add_p("README.md в react — инструкция «с нуля» для другой машины.", indent=False)

add_heading_line("5. Проверка на практике")
add_p("На машине установлен Docker CLI и Colima (лёгкая альтернатива Docker Desktop). Команда:")
add_code("cd /Users/maksim/Documents/react && docker compose up --build -d")
add_p("Результат: контейнеры bazmet-db, bazmet-api, bazmet-web в статусе healthy. Seed записал 5 категорий, 6 услуг, 15 изделий, 46 картинок; в заявках — демо-записи.", space_before=6)
add_p("Проверки:")
add_code("curl http://127.0.0.1:8080/health          → ok")
add_code("curl http://127.0.0.1:8080/api/health     → ok, postgresql, bazmet + bazmet_orders")
add_code("curl http://127.0.0.1:8080/api/products   → count: 15")
add_code("POST /api/orders                         → заявка создана (id ord-…)")
add_p("Сайт открывается в браузере: http://127.0.0.1:8080 — главная, каталог, карточка, форма заявки.", space_before=6)

add_heading_line("6. Инструкция для другой машины (кратко)")
add_p("1. Установить Docker Desktop или Colima + docker + docker compose.")
add_p("2. Разместить папки react и database рядом.")
add_p("3. cd react && docker compose up --build -d")
add_p("4. Открыть http://127.0.0.1:8080")
add_p("5. Остановка: docker compose down (с очисткой данных: docker compose down -v).")

add_heading_line("7. Ответы на вопросы темы")
add_p("Развёртывание в сети. Приложение упаковано в образы и поднимается compose на любой машине с Docker. Публикация в Интернет (VPS, облако) для оценки не обязательна: достаточно локального compose с пробросом порта 8080.")
add_p("Геопривязка. Для учебного сайта метизов геотаргетинг не настраивался. На проде обычно указывают регион в метаданных, Яндекс/Google Business и локальные сниппеты — это уже этап продвижения после размещения.")
add_p("Ускорение индексации. После публикации помогают sitemap.xml и robots.txt (сделаны в работе № 12), корректные title/description и отдачу 200 по человекочитаемым URL. Хостинг в Docker сам по себе индекс не ускоряет — важно, чтобы сайт был доступен с постоянного адреса.")
add_p("Мониторинг позиций. Отдельные сервисы (Яндекс.Вебмастер, Search Console) в стек не включались. Для работы № 13 достаточно проверить доступность health и каталога; мониторинг позиций — следующий шаг после выкладки в сеть.")

add_heading_line("8. Заключение")
add_p("Собран Docker-стек «БазМет» без CMS: PostgreSQL, Express API и React на Nginx. Стек поднимается одной командой docker compose up --build, seed выполняется автоматически при первом старте, инструкция записана в README и проверена: сайт отвечает на :8080, API отдаёт каталог и принимает заявки. Работа № 13 выполнена.")

os.makedirs("/Users/maksim/Documents/РВБ-13", exist_ok=True)
out1 = "/Users/maksim/Documents/РВБ-13/РВБ-13.docx"
out2 = "/Users/maksim/Documents/РВБ-13.docx"
doc.save(out1)
doc.save(out2)
print(out1)
print(out2)
