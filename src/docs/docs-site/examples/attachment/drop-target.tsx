import { FileDropZone } from "@/components/ui/attachment"
import { snackbar } from "@/components/ui/snackbar"

export default function AttachmentDropTarget() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <FileDropZone
        icon="description"
        title={
          <>
            Drop config or <span className="text-primary">browse</span>
          </>
        }
        description="YAML, JSON or CSV"
        acceptedFileTypes={[".yaml", ".yml", ".json", ".csv"]}
        onFiles={(files) => snackbar(`${files.length} file(s) ready to import`)}
      />
      <FileDropZone isDropTarget dropLabel="Release to import" dropDescription="3 files" />
    </div>
  )
}
