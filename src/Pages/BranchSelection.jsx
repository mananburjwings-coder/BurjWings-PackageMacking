import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Building2,
  ShieldCheck,
  UserCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"; // Eye આઈકોન્સ ઉમેર્યા

export default function BranchSelection() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // પાસવર્ડ દેખાડવા માટેનું સ્ટેટ
  const [formData, setFormData] = useState({
    username: "",
    branch: "",
    password: "",
    role: "B2C",
  });

  const validUsernames = [
    "Nikunj001",
    "Richha2011",
    "Vikram2211",
    "SK1110",
    "Manan1120",
  ];
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!formData.username || !formData.branch || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!validUsernames.includes(formData.username)) {
      setError("Invalid username");
      return;
    }

    const passwords = {
      Dubai: ["@BurjWings@#0110"],
      Surat: ["@BurjWings@#0110"],
      UP: ["@BurjWings@#0110"],
    };

    if (
      !passwords[formData.branch] ||
      !passwords[formData.branch].includes(formData.password)
    ) {
      setError("Invalid password for selected branch");
      return;
    }

    localStorage.setItem("burjInvoice_loggedIn", "true");
    localStorage.setItem("burjInvoice_branch", formData.branch);
    localStorage.setItem("burjInvoice_email", formData.username);
    localStorage.setItem("burjInvoice_role", formData.role.toLowerCase());

    localStorage.setItem("userBranch", formData.branch);
    localStorage.setItem("userName", formData.username);
    localStorage.setItem("userRole", formData.role);

    navigate("/Dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden text-slate-100">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center pb-8 border-b border-slate-800/50">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 rotate-3">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            Burj Package Booking
          </CardTitle>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Management Portal Login
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pt-8">
          <div className="space-y-2">
            <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-blue-400" /> Username
            </Label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter your username"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                Branch
              </Label>
              <Select
                value={formData.branch}
                onValueChange={(v) => setFormData({ ...formData, branch: v })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 outline-none focus:ring-2 focus:ring-blue-500/50">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white z-[100]">
                  <SelectItem
                    value="Dubai"
                    className="focus:bg-blue-600 focus:text-white cursor-pointer"
                  >
                    Burj Wings (Dubai)
                  </SelectItem>
                  <SelectItem
                    value="Surat"
                    className="focus:bg-blue-600 focus:text-white cursor-pointer"
                  >
                    GDO - Surat
                  </SelectItem>
                  <SelectItem
                    value="UP"
                    className="focus:bg-blue-600 focus:text-white cursor-pointer"
                  >
                    GDO - UP
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                Access Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 outline-none focus:ring-2 focus:ring-blue-500/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white z-[100]">
                  <SelectItem
                    value="B2C"
                    className="focus:bg-blue-600 focus:text-white cursor-pointer"
                  >
                    B2C Rate
                  </SelectItem>
                  <SelectItem
                    value="B2B"
                    className="focus:bg-blue-600 focus:text-white cursor-pointer"
                  >
                    B2B Rate
                  </SelectItem>
                  <SelectItem
                    value="admin"
                    className="focus:bg-blue-600 focus:text-white cursor-pointer"
                  >
                    Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" /> Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"} // સ્ટેટ મુજબ ટાઇપ બદલાશે
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="bg-slate-800/50 border-slate-700 text-white h-12 focus:ring-blue-500/20 transition-all placeholder:text-slate-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            disabled={
              !formData.username || !formData.branch || !formData.password
            }
          >
            Sign In to Dashboard
          </Button>

          <div className="flex justify-center items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest pt-4">
            <ShieldCheck className="w-3 h-3" /> Secure Access Only
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
