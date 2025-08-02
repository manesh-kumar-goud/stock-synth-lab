import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PredictionFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const PredictionForm = ({ onSubmit, isLoading }: PredictionFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [model, setModel] = useState("");
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({});
  const [predictionDays, setPredictionDays] = useState("7");

  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "NVDA", name: "NVIDIA Corp." },
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "NFLX", name: "Netflix Inc." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !model) return;

    onSubmit({
      symbol,
      model,
      dateRange,
      predictionDays: parseInt(predictionDays)
    });
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Stock Prediction Setup
        </CardTitle>
        <CardDescription>
          Configure your prediction parameters and select AI models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stock Symbol */}
          <div className="space-y-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <div className="space-y-2">
              <Input
                id="symbol"
                placeholder="e.g., AAPL, GOOGL, TSLA"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="bg-background border-border/50"
              />
              <div className="text-xs text-muted-foreground">Popular stocks:</div>
              <div className="flex flex-wrap gap-2">
                {popularStocks.slice(0, 4).map((stock) => (
                  <Button
                    key={stock.symbol}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSymbol(stock.symbol)}
                    className="h-7 text-xs bg-background border-border/50 hover:bg-accent"
                  >
                    {stock.symbol}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue placeholder="Select prediction model" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="lstm">LSTM (Long Short-Term Memory)</SelectItem>
                <SelectItem value="rnn">RNN (Recurrent Neural Network)</SelectItem>
                <SelectItem value="both">Compare Both Models</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Training Data Period</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal bg-background border-border/50",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "MMM dd") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal bg-background border-border/50",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "MMM dd") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    disabled={(date) => date > new Date() || (dateRange.from && date < dateRange.from)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Prediction Days */}
          <div className="space-y-2">
            <Label htmlFor="days">Prediction Period</Label>
            <Select value={predictionDays} onValueChange={setPredictionDays}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
            disabled={!symbol || !model || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Predictions...
              </>
            ) : (
              "Generate Predictions"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};