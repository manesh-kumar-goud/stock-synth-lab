import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, Brain, BarChart3, PieChart } from "lucide-react";
import { StockChart } from "@/components/StockChart";
import { ModelComparison } from "@/components/ModelComparison";
import { PredictionForm } from "@/components/PredictionForm";
import { StatsCards } from "@/components/StatsCards";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [predictions, setPredictions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = async (formData: any) => {
    setIsLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      const mockPredictions = {
        symbol: formData.symbol,
        model: formData.model,
        predictions: {
          lstm: {
            prices: [150, 152, 148, 155, 158, 160, 162],
            accuracy: 85.2,
            rmse: 2.34,
            mae: 1.89,
            trainingTime: 45
          },
          rnn: {
            prices: [149, 151, 147, 154, 156, 159, 161],
            accuracy: 82.7,
            rmse: 2.67,
            mae: 2.12,
            trainingTime: 32
          }
        },
        actualPrices: [148, 149, 150, 151, 152, 153, 154],
        dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07']
      };
      setPredictions(mockPredictions);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary shadow-glow">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Stock Synth Lab
                </h1>
                <p className="text-muted-foreground">AI-Powered Stock Price Prediction</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Market Data
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">
            Predict Stock Prices with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Models
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare LSTM and RNN neural networks for accurate stock price forecasting using real-time market data
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prediction Form */}
          <div className="lg:col-span-1">
            <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
          </div>

          {/* Charts and Results */}
          <div className="lg:col-span-2 space-y-6">
            {predictions ? (
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
                  <TabsTrigger value="chart" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Price Chart
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Model Comparison
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Metrics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="space-y-4">
                  <StockChart data={predictions} />
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                  <ModelComparison data={predictions} />
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LSTM Metrics */}
                    <Card className="border-border/50 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-chart-1" />
                          LSTM Model
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-semibold text-success">{predictions.predictions.lstm.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">RMSE</span>
                          <span className="font-semibold">{predictions.predictions.lstm.rmse}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MAE</span>
                          <span className="font-semibold">{predictions.predictions.lstm.mae}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Training Time</span>
                          <span className="font-semibold">{predictions.predictions.lstm.trainingTime}s</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* RNN Metrics */}
                    <Card className="border-border/50 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-chart-2" />
                          RNN Model
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-semibold text-success">{predictions.predictions.rnn.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">RMSE</span>
                          <span className="font-semibold">{predictions.predictions.rnn.rmse}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MAE</span>
                          <span className="font-semibold">{predictions.predictions.rnn.mae}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Training Time</span>
                          <span className="font-semibold">{predictions.predictions.rnn.trainingTime}s</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="border-border/50 shadow-card">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center space-y-4">
                    <Activity className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">No Predictions Yet</h3>
                      <p className="text-muted-foreground">
                        Select a stock symbol and model to start generating predictions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;