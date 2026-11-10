#!/usr/bin/env python3
"""Convierte las secciones estáticas de index.html a componentes TSX (marcado idéntico).
Uso: python3 tools/html2jsx.py <index.html> <carpeta_salida>
"""
import ast, json, re, sys
from bs4 import BeautifulSoup, Tag, NavigableString, Comment

VOID = {'img', 'input', 'br', 'hr', 'source', 'meta', 'link'}
INLINE = {'a','span','strong','em','b','i','img','button','input','label','small','svg','br','sup','sub','u','code','select','textarea'}
ATTR_MAP = {'class':'className','for':'htmlFor','maxlength':'maxLength','viewbox':'viewBox','tabindex':'tabIndex',
            'autocomplete':'autoComplete','crossorigin':'crossOrigin','readonly':'readOnly','colspan':'colSpan'}
NUMERIC = {'maxLength','rows','cols','colSpan','rowSpan','tabIndex'}
BOOL = {'hidden','disabled','required','checked','selected','multiple','readonly','autofocus'}

def js_str(s):  # literal de cadena JSX segura
    return json.dumps(s, ensure_ascii=False)

def parse_handler(code):
    m = re.match(r"^\s*(\w+)\((.*)\)\s*;?\s*$", code, re.S)
    fn, raw = m.group(1), m.group(2).strip()
    args = []
    if raw:
        args = ast.literal_eval("[" + re.sub(r"\bthis\b", "'$el'", raw) + "]")
    return fn, args

def style_obj(css):
    items = []
    for decl in [d for d in css.split(';') if d.strip()]:
        k, v = decl.split(':', 1)
        k = k.strip(); v = v.strip()
        key = k if k.startswith('--') else re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
        items.append(f"{js_str(key) if k.startswith('--') else key}: {js_str(v)}")
    return "{{ " + ", ".join(items) + " }}"

def attrs_jsx(tag):
    out = []
    for k, v in tag.attrs.items():
        if isinstance(v, list): v = ' '.join(v)
        if k in ('onclick', 'onchange'):
            fn, args = parse_handler(v)
            out.append(f'data-{"click" if k=="onclick" else "change"}="{fn}"')
            if args: out.append('data-args={' + js_str(json.dumps(args, ensure_ascii=False)) + '}')
            continue
        if k == 'style':
            out.append('style=' + style_obj(v)); continue
        name = ATTR_MAP.get(k, k)
        if k == 'src' and v == '':
            continue  # React 19 avisa por src=""; el script asigna la imagen después
        if k in BOOL and (v == '' or v == k):
            out.append(name); continue
        if name in NUMERIC and v.strip().isdigit():
            out.append(f'{name}={{{int(v)}}}'); continue
        if re.search(r'["{}\\&<>]', v) or '\n' in v:
            out.append(f'{name}={{{js_str(v)}}}')
        else:
            out.append(f'{name}="{v}"')
    return (' ' + ' '.join(out)) if out else ''

def is_inline(n):
    return isinstance(n, NavigableString) and not isinstance(n, Comment) or (isinstance(n, Tag) and n.name in INLINE)

def children_jsx(tag, ind, slot=None):
    raw = [c for c in tag.children if not isinstance(c, Comment)]
    if slot:  # tarjetas huérfanas fuera de la cuadrícula (error del HTML original): las renderiza la base de datos
        raw = [c for c in raw if not (isinstance(c, Tag) and 'product-card' in (c.get('class') or []))]
    kids = []
    for c in raw:
        if isinstance(c, NavigableString) and kids and isinstance(kids[-1], NavigableString):
            kids[-1] = NavigableString(str(kids[-1]) + str(c))  # une textos contiguos
        else:
            kids.append(c)
    out = []
    for i, c in enumerate(kids):
        prev = kids[i-1] if i > 0 else None
        nxt = kids[i+1] if i+1 < len(kids) else None
        if isinstance(c, NavigableString):
            t = str(c)
            if not t.strip():
                if prev is not None and nxt is not None and is_inline(prev) and is_inline(nxt):
                    out.append(ind + '{" "}')
                continue
            core = re.sub(r'\s+', ' ', t).strip()
            if t[0].isspace() and prev is not None and is_inline(prev): out.append(ind + '{" "}')
            out.append(ind + (('{' + js_str(core) + '}') if re.search(r'[{}<>&\\]', core) else core))
            if t[-1].isspace() and nxt is not None and is_inline(nxt): out.append(ind + '{" "}')
        else:
            out.append(el_jsx(c, ind, slot))
    return out

def el_jsx(tag, ind, slot=None):
    a = attrs_jsx(tag)
    if slot and tag.get('id') == slot:
        return f"{ind}<{tag.name}{a}>\n{ind}  {{children}}\n{ind}</{tag.name}>"
    kids = children_jsx(tag, ind + '  ', slot)
    if not kids:
        return f"{ind}<{tag.name}{a} />" if tag.name in VOID or tag.name in ('path','circle','rect') else f"{ind}<{tag.name}{a}></{tag.name}>"
    if tag.name in VOID:
        return f"{ind}<{tag.name}{a} />"
    return f"{ind}<{tag.name}{a}>\n" + "\n".join(kids) + f"\n{ind}</{tag.name}>"

def component(name, tag, slot=None):
    body = el_jsx(tag, '    ', slot)
    sig = "{ children }: { children: React.ReactNode }" if slot else ""
    return f"// Generado desde index.html (marcado idéntico al original). Revisar antes de editar a mano.\nexport default function {name}({sig}) {{\n  return (\n{body}\n  );\n}}\n"

def main(src, outdir):
    import os
    soup = BeautifulSoup(open(src, encoding='utf-8').read(), 'html.parser')
    top = [c for c in soup.body.children if isinstance(c, Tag) and c.name != 'script']
    names = ['Loader', 'Navbar', 'Hero', 'HowItWorks', 'ProductsSection', 'CartBar', 'CartaDigital',
             'Testimonios', 'Contacto', 'Footer', 'WhatsAppFloat', 'Lightbox']
    assert len(top) == len(names), (len(top), [t.name for t in top])
    os.makedirs(outdir, exist_ok=True)
    for n, t in zip(names, top):
        slot = 'productGrid' if n == 'ProductsSection' else None
        open(os.path.join(outdir, n + '.tsx'), 'w', encoding='utf-8').write(component(n, t, slot))
        print('OK', n, t.name, t.get('id'))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
