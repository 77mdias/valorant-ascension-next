import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentUserProfile } from "@/server/profileActions";
import Link from "next/link";
import ProfileHeader from "./components/ProfileHeader";
import ProfileForm from "./components/ProfileForm";
import SubscriptionInfo from "./components/SubscriptionInfo";

export const metadata = {
  title: "Meu Perfil | Valorant Ascension",
  description: "Gerencie suas informações de perfil",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const result = await getCurrentUserProfile();

    if (!result.success) {
      throw new Error("Erro ao carregar perfil");
    }

    const { data: profile } = result;

    return (
      <div className="min-h-screen bg-[var(--all-black)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cabeçalho com Avatar e Info Principal */}
          <ProfileHeader
            name={profile.name}
            nickname={profile.nickname}
            email={profile.email}
            image={profile.image}
            role={profile.role}
          />

          {/* Informações da Assinatura */}
          {profile.subscription && (
            <SubscriptionInfo subscription={profile.subscription} />
          )}

          {/* Formulário de Edição */}
          <ProfileForm
            currentData={{
              name: profile.name || "",
              nickname: profile.nickname || "",
              image: profile.image || "",
            }}
          />

          {/* Informações Adicionais */}
          <div className="bg-[var(--card-product)] rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Informações da Conta
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status da conta:</span>
                <span
                  className={`font-medium ${profile.isActive ? "text-green-500" : "text-red-500"}`}
                >
                  {profile.isActive ? "Ativa" : "Inativa"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email verificado:</span>
                <span
                  className={`font-medium ${profile.emailVerified ? "text-green-500" : "text-yellow-500"}`}
                >
                  {profile.emailVerified ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Membro desde:</span>
                <span className="text-white font-medium">
                  {new Date(profile.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Última atualização:</span>
                <span className="text-white font-medium">
                  {new Date(profile.updatedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    return (
      <div className="min-h-screen bg-[var(--all-black)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Erro ao carregar perfil
          </h1>
          <p className="text-gray-400 mb-6">
            Ocorreu um erro ao carregar suas informações. Tente novamente mais
            tarde.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }
}
