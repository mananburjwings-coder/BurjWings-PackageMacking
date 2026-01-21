import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, User } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function BranchSelection() {
  const [formData, setFormData] = useState({
    username: "",
    branch: "",
    password: "",
    role: "B2C",
  });

  const validUsernames = [
    "RichhaBW",
    "VikramDD",
    "PPnikunj",
    "Asal@11",
    "Kishan@ST",
  ];
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!formData.username || !formData.branch || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate username
    if (!validUsernames.includes(formData.username)) {
      setError("Invalid username");
      return;
    }

    // Validate password based on branch
    const passwords = {
      Dubai: "Burjwing@11",
      Surat: "Surat@@1110",
      UP: "Up@5500",
    };

    if (formData.password !== passwords[formData.branch]) {
      setError("Invalid password for selected branch");
      return;
    }

    localStorage.setItem("userBranch", formData.branch);
    localStorage.setItem("userName", formData.username);
    localStorage.setItem("userRole", formData.role);
    window.location.href = createPageUrl("Dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome to Travel Booking</CardTitle>
          <p className="text-slate-600 text-sm">
            Select your branch to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Username</Label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Select Branch</Label>
            <Select
              value={formData.branch}
              onValueChange={(v) => setFormData({ ...formData, branch: v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose your branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dubai">Burj Wings Tourism LLC</SelectItem>
                <SelectItem value="Surat">Go Dubai Online - Surat</SelectItem>
                <SelectItem value="UP">Go Dubai Online - UP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Select Role</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => setFormData({ ...formData, role: v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B2C">B2C (Customer Rates)</SelectItem>
                <SelectItem value="B2B">B2B (Business Rates)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter branch password"
              className="h-11"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            disabled={
              !formData.username || !formData.branch || !formData.password
            }
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
