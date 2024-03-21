import xml.etree.ElementTree as ET


def unKebab(name: str):
    head, *rest = name.split('-')
    broke = [head] + [x[0].upper() + x[1:] for x in rest]
    return ''.join(broke)



if __name__ == '__main__':
    tree = ET.parse('try.svg')
    for e in tree.iter():
        if hasattr(e, 'tag'):
            if e.tag == 'tspan':
                e.tag = 'TSpan'
            e.tag = e.tag[0].upper() + e.tag[1:]
        items = list(e.items())
        for key, value in e.items():
            if key in ('font-family',):
                continue
            key2 = unKebab(key)
            e.set(key2, value)
            if key != key2:
                del e.attrib[key]
    tree.write('out.svg')
