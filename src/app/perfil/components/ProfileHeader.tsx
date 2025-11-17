import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@prisma/client";
import { Crown, Shield, User } from "lucide-react";

interface ProfileHeaderProps {
  name: string | null;
  nickname: string | null;
  email: string;
  image: string | null;
  role: UserRole;
}

const roleConfig = {
  ADMIN: {
    label: "Administrador",
    icon: Crown,
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  PROFESSIONAL: {
    label: "Profissional",
    icon: Shield,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  CUSTOMER: {
    label: "Cliente",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
};

export default function ProfileHeader({
  name,
  nickname,
  email,
  image,
  role,
}: ProfileHeaderProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  // Gerar iniciais para fallback do avatar
  const getInitials = () => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (nickname) {
      return nickname.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[var(--card-product)] rounded-lg p-6 sm:p-8 border border-gray-800">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-gray-700">
            <AvatarImage src={image || undefined} alt={name || nickname || email} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Role Badge no Avatar */}
          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${config.bgColor} ${config.borderColor} border rounded-full px-3 py-1 flex items-center gap-1`}>
            <Icon className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">{config.label}</span>
          </div>
        </div>

        {/* Informações */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {name || nickname || "Sem nome"}
          </h1>

          {nickname && name !== nickname && (
            <p className="text-gray-400 mb-2">@{nickname}</p>
          )}

          <p className="text-gray-500 mb-4">{email}</p>

          {/* Badge de Role */}
          <Badge
            className={`bg-gradient-to-r ${config.gradient} text-white border-0`}
          >
            <Icon className="w-4 h-4 mr-1" />
            {config.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}
