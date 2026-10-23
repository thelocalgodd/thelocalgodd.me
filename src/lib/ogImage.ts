import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import satori from 'satori'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630
const FONT_DIR = resolve('src/assets/fonts')

interface OgImageText {
  title: string
  meta: string
}

// Satori takes React-like element objects. Plain objects keep this file free of JSX.
type Node = { type: string; props: { style?: Record<string, string | number>; children?: Node | Node[] | string } }

function el(style: Record<string, string | number>, children: Node['props']['children']): Node {
  return { type: 'div', props: { style: { display: 'flex', ...style }, children } }
}

async function loadFonts() {
  const [newsreader, iosevka] = await Promise.all(
    ['Newsreader.woff2', 'IosevkaCharon-400.woff2'].map((name) => readFile(resolve(FONT_DIR, name))),
  )
  return [
    { name: 'Newsreader', data: newsreader, weight: 400 as const, style: 'normal' as const },
    { name: 'Iosevka Charon', data: iosevka, weight: 400 as const, style: 'normal' as const },
  ]
}

let fonts: ReturnType<typeof loadFonts> | undefined

export async function renderOgImage({ title, meta }: OgImageText): Promise<Uint8Array<ArrayBuffer>> {
  fonts ??= loadFonts()

  const tree = el(
    {
      // Satori adds padding to a 100% size, so give the box the exact canvas size.
      width: WIDTH,
      height: HEIGHT,
      boxSizing: 'border-box',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 80,
      backgroundColor: '#fdf0da',
      color: '#1a1a1a',
    },
    [
      el({ fontFamily: 'Iosevka Charon', fontSize: 28, color: '#15803d' }, 'thelocalgodd.me'),
      el({ fontFamily: 'Newsreader', fontSize: 76, lineHeight: 1.15 }, title),
      el({ justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'Iosevka Charon', fontSize: 26 }, [
        el({ opacity: 0.6 }, meta),
        el({ fontFamily: 'Newsreader', fontSize: 34 }, [
          el({}, 'Vincent Kwaku Kpemlie'),
          el({ color: '#15803d' }, '.'),
        ]),
      ]),
    ],
  )

  // Satori's types expect a ReactNode; the element objects above have the same shape.
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: await fonts,
  })
  return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer())
}
