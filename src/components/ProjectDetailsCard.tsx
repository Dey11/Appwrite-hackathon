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
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Your project information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Project ID</Label>
          <div className="flex items-center gap-2">
            <Input value={projectId} readOnly className="w-48" />
            <Button
              size="icon"
              variant="outline"
              onClick={() => copyToClipboard(projectId)}
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
              className="w-48"
              type="password"
            />
            <Button
              size="icon"
              variant="outline"
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
                <Link href={`http://localhost:3000/preview/${projectId}`}>
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
                  className={`border bg-transparent text-zinc-500 hover:bg-transparent`}
                >{`http://localhost:3000/preview/${projectId}`}</Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      `http://localhost:3000/preview/${projectId}`,
                    )
                  }
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
            <span>Live</span>
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
