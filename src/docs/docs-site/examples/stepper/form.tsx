import { useState } from "react"

import { snackbar } from "@/components/ui/snackbar"
import { Stepper, StepperActions, StepperItem, StepperList, StepperPanel } from "@/components/ui/stepper"
import { TextField } from "@/components/ui/text-field"

type Student = { firstName: string; lastName: string; studentId: string; grade: string; section: string; guardian: string; phone: string }

const REQUIRED: (keyof Student)[][] = [["firstName", "lastName", "studentId"], ["grade", "section"], ["guardian", "phone"]]
const TAKEN_IDS = ["ST-1001", "ST-1002"]
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function StepperForm() {
  const [student, setStudent] = useState<Student>({ firstName: "", lastName: "", studentId: "", grade: "", section: "", guardian: "", phone: "" })
  const [checked, setChecked] = useState<number[]>([])
  const [idTaken, setIdTaken] = useState(false)
  const [saving, setSaving] = useState(false)

  const missing = (step: number) => REQUIRED[step].filter((key) => !student[key].trim())
  const hasErrors = (step: number) => checked.includes(step) && (missing(step).length > 0 || (step === 0 && idTaken))

  const field = (key: keyof Student, label: string, step: number) => (
    <TextField
      label={label}
      value={student[key]}
      onChange={(value) => {
        setStudent({ ...student, [key]: value })
        if (key === "studentId") setIdTaken(false)
      }}
      isInvalid={checked.includes(step) && !student[key].trim()}
      errorMessage="Required"
    />
  )

  const validate = async (step: number) => {
    setChecked((c) => (c.includes(step) ? c : [...c, step]))
    if (missing(step).length) return false
    if (step === 0) {
      await wait(700)
      const taken = TAKEN_IDS.includes(student.studentId.trim().toUpperCase())
      setIdTaken(taken)
      return !taken
    }
    return true
  }

  const create = async () => {
    setSaving(true)
    await wait(1600)
    setSaving(false)
    snackbar(`${student.firstName} ${student.lastName} added`)
  }

  return (
    <Stepper validate={validate} className="w-full max-w-2xl">
      <StepperList aria-label="New student">
        <StepperItem title="Basic" status={hasErrors(0) ? "error" : undefined} description={hasErrors(0) ? "Check the fields" : undefined} />
        <StepperItem title="Academic" status={hasErrors(1) ? "error" : undefined} description={hasErrors(1) ? "Check the fields" : undefined} />
        <StepperItem title="Guardian" status={hasErrors(2) ? "error" : undefined} description={hasErrors(2) ? "Check the fields" : undefined} />
      </StepperList>
      <StepperPanel step={0} className="grid gap-4 sm:grid-cols-2">
        {field("firstName", "First name", 0)}
        {field("lastName", "Last name", 0)}
        <TextField
          label="Student ID"
          description="Try ST-1001 to see a taken ID"
          value={student.studentId}
          onChange={(value) => {
            setStudent({ ...student, studentId: value })
            setIdTaken(false)
          }}
          isInvalid={(checked.includes(0) && !student.studentId.trim()) || idTaken}
          errorMessage={idTaken ? "This ID is already in use" : "Required"}
        />
      </StepperPanel>
      <StepperPanel step={1} className="grid gap-4 sm:grid-cols-2">
        {field("grade", "Grade", 1)}
        {field("section", "Section", 1)}
      </StepperPanel>
      <StepperPanel step={2} className="grid gap-4 sm:grid-cols-2">
        {field("guardian", "Guardian name", 2)}
        {field("phone", "Phone", 2)}
      </StepperPanel>
      <StepperActions finishLabel="Create" isPending={saving} onFinish={create} />
    </Stepper>
  )
}
