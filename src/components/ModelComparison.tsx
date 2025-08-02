import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Brain, Activity, Clock, Target, TrendingUp } from "lucide-react";

interface ModelComparisonProps {
  data: any;
}

export const ModelComparison = ({ data }: ModelComparisonProps) => {
  const comparisonData = [
    {
      metric: "Accuracy",
      lstm: data.predictions.lstm.accuracy,
      rnn: data.predictions.rnn.accuracy,
      unit: "%"
    },
    {
      metric: "RMSE",
      lstm: data.predictions.lstm.rmse,
      rnn: data.predictions.rnn.rmse,
      unit: ""
    },
    {
      metric: "MAE",
      lstm: data.predictions.lstm.mae,
      rnn: data.predictions.rnn.mae,
      unit: ""
    },
    {
      metric: "Training Time",
      lstm: data.predictions.lstm.trainingTime,
      rnn: data.predictions.rnn.trainingTime,
      unit: "s"
    }
  ];

  const pieData = [
    { name: "LSTM Accuracy", value: data.predictions.lstm.accuracy, color: "hsl(var(--chart-1))" },
    { name: "RNN Accuracy", value: data.predictions.rnn.accuracy, color: "hsl(var(--chart-2))" }
  ];

  const getBetter = (metric: string, lstm: number, rnn: number) => {
    if (metric === "Accuracy") return lstm > rnn ? "lstm" : "rnn";
    if (metric === "RMSE" || metric === "MAE") return lstm < rnn ? "lstm" : "rnn";
    if (metric === "Training Time") return lstm < rnn ? "lstm" : "rnn";
    return "lstm";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey.toUpperCase()}: {entry.value}
              {comparisonData.find(d => d.metric === label)?.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-chart-1" />
            Model Performance Comparison
          </CardTitle>
          <CardDescription>
            Head-to-head comparison of LSTM vs RNN models for {data.symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="metric" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lstm" fill="hsl(var(--chart-1))" name="LSTM" radius={[2, 2, 0, 0]} />
                <Bar dataKey="rnn" fill="hsl(var(--chart-2))" name="RNN" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparisonData.map((item, index) => {
          const better = getBetter(item.metric, item.lstm, item.rnn);
          return (
            <Card key={index} className="border-border/50 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {item.metric}
                  {item.metric === "Accuracy" && <TrendingUp className="w-4 h-4 text-success" />}
                  {item.metric === "Training Time" && <Clock className="w-4 h-4 text-warning" />}
                  {(item.metric === "RMSE" || item.metric === "MAE") && <Activity className="w-4 h-4 text-chart-3" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-chart-1" />
                      <span className="text-sm font-medium">LSTM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {item.lstm}{item.unit}
                      </span>
                      {better === "lstm" && (
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-xs">
                          Better
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-chart-2" />
                      <span className="text-sm font-medium">RNN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {item.rnn}{item.unit}
                      </span>
                      {better === "rnn" && (
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-xs">
                          Better
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress visualization for accuracy */}
                {item.metric === "Accuracy" && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">LSTM Accuracy</div>
                    <Progress value={item.lstm} className="h-2" />
                    <div className="text-xs text-muted-foreground">RNN Accuracy</div>
                    <Progress value={item.rnn} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Winner Summary */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Model Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Overall Winner</h3>
              {data.predictions.lstm.accuracy > data.predictions.rnn.accuracy ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-1/20 border border-chart-1/30">
                    <Brain className="w-6 h-6 text-chart-1" />
                  </div>
                  <div>
                    <div className="font-semibold text-chart-1">LSTM Model</div>
                    <div className="text-sm text-muted-foreground">
                      Higher accuracy: {data.predictions.lstm.accuracy}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-2/20 border border-chart-2/30">
                    <Activity className="w-6 h-6 text-chart-2" />
                  </div>
                  <div>
                    <div className="font-semibold text-chart-2">RNN Model</div>
                    <div className="text-sm text-muted-foreground">
                      Higher accuracy: {data.predictions.rnn.accuracy}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Key Insights</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• LSTM better for long-term dependencies</li>
                <li>• RNN faster training for short sequences</li>
                <li>• Consider ensemble methods for best results</li>
                <li>• Model performance varies by stock volatility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};