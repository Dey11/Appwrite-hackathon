import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Copy } from "lucide-react"
import Link from "next/link"

interface ProjectDetailsCardProps {
  projectId: string
  secretKey: string
  isLive: boolean
  setIsLive: React.Dispatch<React.SetStateAction<boolean>>
  copyToClipboard: (text: string) => void
  onSaveChanges: () => void
  valid: boolean
  submitting: boolean
  hasChanges: boolean
}

export default function ProjectDetailsCard({
  projectId,
  secretKey,
  isLive,
  setIsLive,
  copyToClipboard,
  onSaveChanges,
  valid,
  submitting,
  hasChanges,
}: ProjectDetailsCardProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50 shadow-lg">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Your project information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Project ID</Label>
          <div className="flex items-center gap-2">
            <Input
              value={projectId}
              readOnly
              className="mt-1.5 w-48 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => copyToClipboard(projectId)}
              className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Secret Key</Label>
          <div className="flex items-center gap-2">
            <Input
              value={secretKey}
              readOnly
              className="mt-1.5 w-48 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
              type="password"
            />
            <Button
              size="icon"
              variant="outline"
              className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
              onClick={() => copyToClipboard(secretKey)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          {isLive ? (
            <div className="flex items-center justify-between">
              <Label>Preview url</Label>
              <div className="flex items-center gap-2">
                <Link
                  href={`http://localhost:3000/preview/${projectId}`}
                  className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
                >
                  <Button
                    className={`w-full border bg-transparent text-white hover:bg-transparent hover:underline`}
                  >{`http://localhost:3000/preview/${projectId}`}</Button>
                </Link>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      `http://localhost:3000/preview/${projectId}`,
                    )
                  }
                  className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Label>Preview url</Label>
              <div className="flex items-center gap-2">
                <Button
                  className={`mt-1.5 border border-zinc-800 bg-transparent bg-zinc-900 text-zinc-500 placeholder:text-zinc-500 hover:bg-transparent focus:border-[#FE8888] focus:ring-[#FE8888]`}
                >{`http://localhost:3000/preview/${projectId}`}</Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      `http://localhost:3000/preview/${projectId}`,
                    )
                  }
                  className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Label>Form Status</Label>
          <div className="flex items-center gap-2">
            <Switch checked={isLive} onCheckedChange={setIsLive} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            onClick={onSaveChanges}
            disabled={!valid || submitting || !hasChanges}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button>Export as component</Button>
        </div>
      </CardContent>
    </Card>
  )
}
