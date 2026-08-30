import DrawDetailPrototype from '@/components/draw-detail-prototype'

type Props = { params: Promise<{ id: string }> }

export default async function DrawDetailPage({ params }: Props) {
  const { id } = await params
  return <DrawDetailPrototype id={id} />
}
