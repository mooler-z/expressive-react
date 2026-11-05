import { ViewableImage } from "@/components/ui/image-viewer"

const students = [
  { name: "Maya Lindqvist", detail: "Grade 10 · Section B", photo: 64 },
  { name: "Ana Silva", detail: "Grade 10 · Section B", photo: 1027 },
  { name: "Lee Park", detail: "Grade 11 · Section A", photo: 832 },
]

export default function ProfilePhoto() {
  return (
    <ul className="flex w-full max-w-sm flex-col">
      {students.map((student) => (
        <li key={student.name} className="flex items-center gap-4 px-4 py-2">
          <ViewableImage
            src={`https://picsum.photos/id/${student.photo}/96/96`}
            fullSrc={`https://picsum.photos/id/${student.photo}/1000/1000`}
            alt={`Profile photo of ${student.name}`}
            title={student.name}
            description={student.detail}
            className="size-12 rounded-md"
          />
          <div className="min-w-0">
            <p className="truncate text-body-lg text-on-surface">{student.name}</p>
            <p className="truncate text-body-md text-on-surface-variant">{student.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
