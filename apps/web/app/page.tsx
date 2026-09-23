
import LoginButton from "@/components/auth/login-button"
import { DepthComponent } from "@/components/Depth/Depth"
import TradeComponent from "@/components/Trades"
import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <main className="flex flex-col h-full items-center justify-center">
      <div className="space-y-3">
        <h1>Crossbook</h1>
        <LoginButton>
          Get Started
        </LoginButton>
      </div>
    </main>
  )
}


/**
 *  <div className="text-muted-foreground font-mono text-xs">
          (Press <kbd>d</kbd> to toggle dark mode)
          
        </div>
 */