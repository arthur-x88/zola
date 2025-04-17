import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MODELS_OPTIONS, PROVIDERS_OPTIONS } from "../../../lib/config"

export type SelectModelProps = {
  selectedModel: string
  onSelectModel: (model: string) => void
  isUserAuthenticated: boolean
}

export function SelectModel({
  selectedModel,
}: SelectModelProps) {
  const model = MODELS_OPTIONS.find((model) => model.id === selectedModel)
  const provider = PROVIDERS_OPTIONS.find(
    (provider) => provider.id === model?.provider
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="border-border dark:bg-secondary text-accent-foreground h-9 w-auto rounded-full border bg-transparent"
          type="button"
          disabled={true}
        >
          {provider?.icon && <provider.icon className="size-5" />}
          {model?.name}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Current model</TooltipContent>
    </Tooltip>
  )
}