"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessSector } from "@/generated/prisma";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  commercialMaturityOptions,
  marketingMaturityOptions,
  sectorQuestions,
} from "@/lib/plan-questions";
import {
  projectPlanFormSchema,
  type ProjectPlanFormData,
} from "../actions/schemas";
import { createProjectPlan } from "../actions/plan.action";
import { useAIProcessing } from "@/contexts/ai-processing-context";

interface NewProjectPlanFormProps {
  userId: string;
}

const sectorNames: Record<BusinessSector, string> = {
  [BusinessSector.ECOMMERCE]: "E-commerce",
  [BusinessSector.SAAS]: "SaaS",
  [BusinessSector.HEALTH]: "Saúde",
  [BusinessSector.FOOD]: "Alimentação",
  [BusinessSector.EDUCATION]: "Educação",
  [BusinessSector.OTHER]: "Outro",
};

export function NewProjectPlanForm({ userId }: NewProjectPlanFormProps) {
  const router = useRouter();
  const { startProcessing, stopProcessing } = useAIProcessing();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const form = useForm<ProjectPlanFormData>({
    resolver: zodResolver(projectPlanFormSchema),
    defaultValues: {
      title: "",
      description: "",
      sector: BusinessSector.HEALTH,
      sectorDetails: {},
      marketingMaturity: "",
      marketingGoal: "",
      commercialMaturity: "",
      commercialGoal: "",
    },
  });

  const selectedSector = form.watch("sector");
  const sectorQuestionsList = sectorQuestions[selectedSector];

  async function onSubmit(data: ProjectPlanFormData) {
    setIsSubmitting(true);
    startProcessing("new-project");

    try {
      const processedData = {
        ...data,
        sectorDetails: Object.fromEntries(
          Object.entries(data.sectorDetails || {}).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(", ") : value,
          ])
        ),
        marketingMaturity: data.marketingMaturity,
        commercialMaturity: data.commercialMaturity,
        marketingGoal: data.marketingGoal,
        commercialGoal: data.commercialGoal,
        userId,
      };

      const result = await createProjectPlan(processedData);

      if (!result.success || !result.data) {
        throw new Error(
          result.error ||
            "Não foi possível criar o plano do projeto. Por favor, tente novamente."
        );
      }

      startProcessing(result.data.id);

      toast.success("Plano do projeto criado com sucesso!");
      router.push(`/project-plans/${result.data.id}`);
    } catch (error) {
      stopProcessing();
      console.error("Erro ao criar plano do projeto:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o plano do projeto. Por favor, tente novamente"
      );
    } finally {
      stopProcessing();
      setIsSubmitting(false);
    }
  }

  const nextStep = () => {
    setStep((prev) => prev + 1);
    setProgress((prev) => prev + 25);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setProgress((prev) => prev - 25);
  };

  const handleTabChange = (value: string) => {
    const newStep = parseInt(value);
    if (newStep === 2 && !selectedSector) {
      toast.error("Selecione um nicho/setor primeiro.");
      return;
    }
    setStep(newStep);
    setProgress(newStep * 25);
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0">
        <CardTitle>Crie um novo planejamento</CardTitle>
        <CardDescription>
          Crie um novo projeto de marketing com as informações do seu cliente.
        </CardDescription>
      </CardHeader>
      <Progress value={progress} className="mb-3" />

      <Tabs
        value={step.toString()}
        onValueChange={handleTabChange}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          <TabsTrigger
            value="1"
            className="text-sm whitespace-nowrap sm:text-base"
          >
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger
            value="2"
            disabled={!selectedSector}
            className="text-sm whitespace-nowrap sm:text-base"
          >
            Detalhes do Setor
          </TabsTrigger>
          <TabsTrigger
            value="3"
            disabled={!selectedSector}
            className="text-sm whitespace-nowrap sm:text-base"
          >
            Marketing
          </TabsTrigger>
          <TabsTrigger
            value="4"
            disabled={!selectedSector}
            className="text-sm whitespace-nowrap sm:text-base"
          >
            Comercial
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            if (step !== 4) {
              e.preventDefault();
              return;
            }
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-8"
        >
          {step === 1 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo do projeto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira o nome do projeto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Insira a descrição do projeto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BusinessSector).map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sectorNames[sector]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="mb-4 text-2xl font-bold">
                Detalhes do Setor: {sectorNames[selectedSector]}
              </h2>
              {sectorQuestionsList.map((question) => (
                <FormField
                  key={question.key}
                  control={form.control}
                  name={`sectorDetails.${question.key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{question.question}</FormLabel>
                      <FormControl>
                        {question.type === "select" ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options?.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : question.type === "radio" ? (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                          >
                            {question.options?.map((option) => (
                              <FormItem
                                key={option.value}
                                className="flex items-center space-y-0 space-x-3"
                              >
                                <FormControl>
                                  <RadioGroupItem value={option.value} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        ) : question.type === "checkbox" ? (
                          <div className="flex flex-col space-y-2">
                            {question.options?.map((option) => (
                              <FormItem
                                key={option.value}
                                className="flex flex-row items-start space-y-0 space-x-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={
                                      Array.isArray(field.value)
                                        ? field.value.includes(option.value)
                                        : false
                                    }
                                    onCheckedChange={(checked) => {
                                      const currentValue = Array.isArray(
                                        field.value
                                      )
                                        ? field.value
                                        : [];
                                      if (checked) {
                                        field.onChange([
                                          ...currentValue,
                                          option.value,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValue.filter(
                                            (value: string) =>
                                              value !== option.value
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                        ) : (
                          <Textarea
                            placeholder="Digite sua resposta"
                            {...field}
                            value={field.value || ""}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="marketingMaturity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Como você descreveria o nível de maturidade em marketing
                      da empresa?
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("marketingGoal", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o nível de maturidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marketingMaturityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("marketingMaturity") && (
                <FormField
                  control={form.control}
                  name="marketingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Qual seria a meta de marketing mais importante para o
                        seu momento atual?
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a meta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {marketingMaturityOptions
                            .find(
                              (opt) =>
                                opt.value === form.watch("marketingMaturity")
                            )
                            ?.goals.map((goal) => (
                              <SelectItem key={goal.value} value={goal.label}>
                                {goal.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="commercialMaturity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Como você descreveria o nível de maturidade do time
                      comercial?
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("commercialGoal", "");
                        setCanSubmit(!!value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o nível de maturidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commercialMaturityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("commercialMaturity") && (
                <FormField
                  control={form.control}
                  name="commercialGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Qual seria a meta comercial mais importante para o seu
                        momento atual?
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCanSubmit(!!value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a meta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {commercialMaturityOptions
                            .find(
                              (opt) =>
                                opt.value === form.watch("commercialMaturity")
                            )
                            ?.goals.map((goal) => (
                              <SelectItem key={goal.value} value={goal.label}>
                                {goal.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Voltar
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Próximo
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !canSubmit}>
                {isSubmitting ? "Criando..." : "Criar novo planejamento"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
}
