import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  Search, Plus, X, Users, Calendar, CheckSquare, DollarSign,
  LayoutDashboard, Phone, Mail, MapPin, Tag as TagIcon, Clock,
  AlertTriangle, TrendingUp, ChevronRight, FileText, Activity,
  MessageCircle, Cake, Stethoscope, Baby, Menu
} from "lucide-react";

/* ---------------------------------------------------------
   Utilidades
--------------------------------------------------------- */
const uid = () => Math.random().toString(36).slice(2, 10);

const calcIdade = (nasc) => {
  if (!nasc) return "-";
  const hoje = new Date();
  const n = new Date(nasc);
  let anos = hoje.getFullYear() - n.getFullYear();
  let meses = hoje.getMonth() - n.getMonth();
  if (hoje.getDate() < n.getDate()) meses--;
  if (meses < 0) { anos--; meses += 12; }
  if (anos < 1) return `${meses}m`;
  return `${anos}a ${meses}m`;
};

const calcIMC = (peso, alturaCm) => {
  if (!peso || !alturaCm) return "-";
  const alturaM = alturaCm / 100;
  return (peso / (alturaM * alturaM)).toFixed(1);
};

const formatMoeda = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatData = (d) => {
  if (!d) return "-";
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
};

const diasDesde = (d) => {
  if (!d) return null;
  const diff = Date.now() - new Date(d).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/* ---------------------------------------------------------
   Dados semente (usados apenas na primeira carga)
--------------------------------------------------------- */
const seedPatients = () => [
  {
    id: uid(),
    nome: "Helena Martins",
    dataNascimento: "2021-03-14",
    sexo: "F",
    escola: "Colégio Pequeno Príncipe",
    diagnostico: "Seletividade alimentar",
    alergias: "Nenhuma",
    medicamentos: "-",
    pediatra: "Dra. Camila Rocha",
    responsavel: "Fernanda Martins (mãe)",
    telefone: "(19) 99123-4455",
    whatsapp: "(19) 99123-4455",
    email: "fernanda.martins@email.com",
    endereco: "Paulínia, SP",
    tags: ["Seletividade alimentar", "Escolar"],
    status: "ativo",
    ultimoContato: "2026-07-22",
    acompanhamento: {
      tipo: "90 dias", dataInicio: "2026-06-01", dataFim: "2026-08-30",
      consultasTotal: 4, consultasRealizadas: 2, valor: 1200,
      formaPagamento: "Pix", parcelas: 3, status: "ativo"
    },
    evolucao: [
      { data: "2026-06-01", peso: 14.2, altura: 96, obs: "Primeira consulta. Recusa vegetais folhosos." },
      { data: "2026-07-01", peso: 14.8, altura: 97, obs: "Aceitou brócolis picado no arroz." }
    ],
    timeline: [
      { data: "2026-06-01", tipo: "consulta", texto: "Primeira consulta realizada." },
      { data: "2026-06-08", tipo: "mensagem", texto: "Follow-up enviado via WhatsApp." },
      { data: "2026-07-01", tipo: "consulta", texto: "Retorno de 30 dias." }
    ]
  },
  {
    id: uid(),
    nome: "Théo Ferraz",
    dataNascimento: "2024-11-02",
    sexo: "M",
    escola: "-",
    diagnostico: "Introdução alimentar",
    alergias: "Suspeita de APLV",
    medicamentos: "-",
    pediatra: "Dr. Marcelo Andrade",
    responsavel: "Juliana Ferraz (mãe)",
    telefone: "(19) 98877-1122",
    whatsapp: "(19) 98877-1122",
    email: "ju.ferraz@email.com",
    endereco: "Campinas, SP",
    tags: ["Introdução alimentar", "Alergia", "Lactente"],
    status: "ativo",
    ultimoContato: "2026-07-28",
    acompanhamento: {
      tipo: "6 meses", dataInicio: "2026-05-10", dataFim: "2026-11-10",
      consultasTotal: 6, consultasRealizadas: 3, valor: 2400,
      formaPagamento: "Cartão", parcelas: 6, status: "ativo"
    },
    evolucao: [
      { data: "2026-05-10", peso: 7.1, altura: 66, obs: "Início da introdução alimentar." },
      { data: "2026-06-10", peso: 7.9, altura: 68, obs: "Boa evolução, sem reações." },
      { data: "2026-07-10", peso: 8.5, altura: 70, obs: "Investigar possível APLV." }
    ],
    timeline: [
      { data: "2026-05-10", tipo: "consulta", texto: "Primeira consulta." },
      { data: "2026-07-10", tipo: "consulta", texto: "Encaminhado para exame de alergia." },
      { data: "2026-07-28", tipo: "mensagem", texto: "Família enviou fotos da aceitação alimentar." }
    ]
  },
  {
    id: uid(),
    nome: "Isadora Prado",
    dataNascimento: "2016-08-30",
    sexo: "F",
    escola: "EE Prof. José Lima",
    diagnostico: "Obesidade infantil",
    alergias: "Nenhuma",
    medicamentos: "-",
    pediatra: "Dra. Renata Silva",
    responsavel: "Marcos Prado (pai)",
    telefone: "(19) 99555-8877",
    whatsapp: "(19) 99555-8877",
    email: "marcos.prado@email.com",
    endereco: "Paulínia, SP",
    tags: ["Obesidade", "Escolar"],
    status: "pausa",
    ultimoContato: "2026-06-02",
    acompanhamento: {
      tipo: "12 meses", dataInicio: "2025-10-01", dataFim: "2026-10-01",
      consultasTotal: 12, consultasRealizadas: 7, valor: 4800,
      formaPagamento: "Boleto", parcelas: 12, status: "pausa"
    },
    evolucao: [
      { data: "2026-04-01", peso: 48.2, altura: 142, obs: "Redução de 1kg no trimestre." },
      { data: "2026-06-01", peso: 47.0, altura: 143, obs: "Família pausou por viagem." }
    ],
    timeline: [
      { data: "2026-06-02", tipo: "nota", texto: "Família solicitou pausa temporária." }
    ]
  },
  {
    id: uid(),
    nome: "Davi Ribeiro",
    dataNascimento: "2019-01-19",
    sexo: "M",
    escola: "Colégio Aprender",
    diagnostico: "TEA - seletividade severa",
    alergias: "Nenhuma",
    medicamentos: "Suplemento vitamínico",
    pediatra: "Dr. Marcelo Andrade",
    responsavel: "Patrícia Ribeiro (mãe)",
    telefone: "(19) 99222-3344",
    whatsapp: "(19) 99222-3344",
    email: "patricia.ribeiro@email.com",
    endereco: "Paulínia, SP",
    tags: ["TEA", "Seletividade alimentar", "Escolar"],
    status: "ativo",
    ultimoContato: "2026-07-29",
    acompanhamento: {
      tipo: "24 meses", dataInicio: "2025-08-01", dataFim: "2027-08-01",
      consultasTotal: 24, consultasRealizadas: 11, valor: 9600,
      formaPagamento: "Pix", parcelas: 24, status: "ativo"
    },
    evolucao: [
      { data: "2026-06-15", peso: 18.4, altura: 108, obs: "Aceita 6 alimentos novos." },
      { data: "2026-07-15", peso: 18.9, altura: 109, obs: "Introduziu proteína animal." }
    ],
    timeline: [
      { data: "2026-07-15", tipo: "consulta", texto: "Retorno mensal realizado." },
      { data: "2026-07-29", tipo: "mensagem", texto: "Pergunta sobre adaptação na escola." }
    ]
  },
  {
    id: uid(),
    nome: "Manuela Costa",
    dataNascimento: "2020-05-05",
    sexo: "F",
    escola: "Escola Semear",
    diagnostico: "Constipação funcional",
    alergias: "Nenhuma",
    medicamentos: "-",
    pediatra: "Dra. Camila Rocha",
    responsavel: "Bianca Costa (mãe)",
    telefone: "(19) 98111-9900",
    whatsapp: "(19) 98111-9900",
    email: "bianca.costa@email.com",
    endereco: "Paulínia, SP",
    tags: ["Constipação", "Escolar"],
    status: "concluido",
    ultimoContato: "2026-05-20",
    acompanhamento: {
      tipo: "90 dias", dataInicio: "2026-02-20", dataFim: "2026-05-20",
      consultasTotal: 4, consultasRealizadas: 4, valor: 1200,
      formaPagamento: "Pix", parcelas: 1, status: "concluido"
    },
    evolucao: [
      { data: "2026-05-20", peso: 16.1, altura: 104, obs: "Alta nutricional. Hábito intestinal regular." }
    ],
    timeline: [
      { data: "2026-05-20", tipo: "consulta", texto: "Alta do acompanhamento." }
    ]
  }
];

const seedFollowups = (patients) => [
  { id: uid(), pacienteId: patients[0].id, titulo: "Cobrar retorno de 30 dias", tipo: "Cobrar retorno", prioridade: "alta", prazo: "2026-07-31", coluna: "hoje", responsavel: "Nutricionista" },
  { id: uid(), pacienteId: patients[1].id, titulo: "Solicitar exame de alergia", tipo: "Solicitar exames", prioridade: "alta", prazo: "2026-08-01", coluna: "aguardando", responsavel: "Secretária" },
  { id: uid(), pacienteId: patients[2].id, titulo: "Cobrar pagamento da parcela 8", tipo: "Cobrar pagamento", prioridade: "media", prazo: "2026-08-03", coluna: "afazer", responsavel: "Secretária" },
  { id: uid(), pacienteId: patients[3].id, titulo: "Enviar plano alimentar atualizado", tipo: "Enviar plano", prioridade: "media", prazo: "2026-07-30", coluna: "andamento", responsavel: "Nutricionista" },
  { id: uid(), pacienteId: patients[3].id, titulo: "Responder dúvida sobre escola", tipo: "Enviar mensagem", prioridade: "baixa", prazo: "2026-07-30", coluna: "hoje", responsavel: "Nutricionista" },
  { id: uid(), pacienteId: patients[4].id, titulo: "Enviar pesquisa de satisfação pós-alta", tipo: "Enviar materiais", prioridade: "baixa", prazo: "2026-08-05", coluna: "concluido", responsavel: "Secretária" }
];

const KANBAN_COLS = [
  { id: "afazer", label: "A fazer" },
  { id: "hoje", label: "Hoje" },
  { id: "andamento", label: "Em andamento" },
  { id: "aguardando", label: "Aguardando família" },
  { id: "concluido", label: "Concluído" }
];

const STATUS_LABEL = { ativo: "Ativo", pausa: "Em pausa", concluido: "Concluído" };
const STATUS_COLOR = { ativo: "#7FAE86", pausa: "#E8B85E", concluido: "#8C99A6" };
const PRIORIDADE_COLOR = { alta: "#F2704A", media: "#E8B85E", baixa: "#8FAF9E" };

/* ---------------------------------------------------------
   Ícone-assinatura: curva de crescimento
--------------------------------------------------------- */
const GrowthMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M3 32 C 10 32, 12 30, 15 24 S 20 8, 26 8 S 33 14, 37 12"
      stroke="#F2704A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="37" cy="12" r="2.5" fill="#F2704A" />
  </svg>
);

/* ---------------------------------------------------------
   App principal
--------------------------------------------------------- */
export default function App() {
  const [patients, setPatients] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [view, setView] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("crm-nutri-data", false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setPatients(parsed.patients || seedPatients());
          setFollowups(parsed.followups || []);
        } else {
          const p = seedPatients();
          setPatients(p);
          setFollowups(seedFollowups(p));
        }
      } catch (e) {
        const p = seedPatients();
        setPatients(p);
        setFollowups(seedFollowups(p));
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(
          "crm-nutri-data",
          JSON.stringify({ patients, followups }),
          false
        );
      } catch (e) {
        console.error("Falha ao salvar:", e);
      }
    })();
  }, [patients, followups, loaded]);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedId) || null,
    [patients, selectedId]
  );

  const filteredPatients = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase();
    return patients.filter((p) =>
      [p.nome, p.diagnostico, p.responsavel, p.telefone, ...(p.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [patients, query]);

  const updatePatient = (id, patch) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const addPatient = (patient) => {
    setPatients((prev) => [{ ...patient, id: uid() }, ...prev]);
  };

  const moveFollowup = (id, coluna) => {
    setFollowups((prev) => prev.map((f) => (f.id === id ? { ...f, coluna } : f)));
  };

  if (!loaded) {
    return (
      <div style={{ ...styles.root, alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#4B615D", fontFamily: "Inter, sans-serif" }}>Carregando…</div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #DCD8CC; border-radius: 8px; }
        button { font-family: inherit; cursor: pointer; }
        input, select, textarea { font-family: inherit; }

        .mobile-menu-btn { display: none; }

        @media (max-width: 860px) {
          .sidebar {
            position: fixed !important; top: 0; left: 0; height: 100vh !important;
            transform: translateX(-100%); transition: transform .25s ease;
            z-index: 100 !important; width: 250px !important;
            box-shadow: 8px 0 24px rgba(0,0,0,0.12);
          }
          .sidebar.mobile-open { transform: translateX(0); }
          .sidebar-close-btn { display: flex !important; }
          .mobile-menu-btn { display: flex !important; }
          .header { padding: 14px 16px !important; }
          .header-search { width: 100% !important; }
          .header-date { display: none !important; }
          .content { padding: 16px !important; }
          .cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
          .table-header { display: none !important; }
          .table-row {
            flex-direction: column !important; align-items: flex-start !important;
            gap: 5px !important; padding: 14px 0 !important;
          }
          .table-row > div { width: 100% !important; }
          .chevron-col { display: none !important; }
          .table-row [data-label]::before {
            content: attr(data-label); display: block; font-size: 10.5px;
            text-transform: uppercase; letter-spacing: 0.4px; color: #8C99A6; margin-bottom: 1px;
          }
          .drawer { width: 100% !important; max-width: 100% !important; }
          .modal {
            width: 100% !important; max-width: 100% !important;
            height: 100% !important; max-height: 100% !important; border-radius: 0 !important;
            margin: 0 !important;
          }
          .info-grid { grid-template-columns: 1fr !important; }
          .new-patient-grid { grid-template-columns: 1fr !important; padding: 16px !important; }
          .modal-footer { padding: 12px 16px !important; }
          .drawer-header, .drawer-body { padding-left: 16px !important; padding-right: 16px !important; }
          .drawer-tabs { padding: 0 16px !important; overflow-x: auto !important; }
          .agenda-row { flex-wrap: wrap !important; }
          .agenda-name { width: 100% !important; }
          .evo-row { flex-wrap: wrap !important; row-gap: 3px !important; }
          .evo-row > div { width: auto !important; }
          .kanban-col { width: 220px !important; }
        }
        @media (max-width: 480px) {
          .cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Sidebar
        view={view}
        setView={(v) => { setView(v); setMobileNavOpen(false); }}
        onNewPatient={() => { setShowNewPatient(true); setMobileNavOpen(false); }}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(22,51,46,0.35)", zIndex: 90 }}
        />
      )}

      <div style={styles.main}>
        <Header query={query} setQuery={setQuery} onMenuClick={() => setMobileNavOpen(true)} />

        <div style={styles.content} className="content">
          {view === "dashboard" && (
            <Dashboard patients={patients} followups={followups} setView={setView} setSelectedId={setSelectedId} />
          )}
          {view === "patients" && (
            <PatientsList
              patients={filteredPatients}
              onOpen={(id) => setSelectedId(id)}
              onNew={() => setShowNewPatient(true)}
            />
          )}
          {view === "agenda" && <Agenda patients={patients} />}
          {view === "followups" && (
            <FollowupsBoard followups={followups} patients={patients} onMove={moveFollowup} />
          )}
          {view === "financeiro" && <Financeiro patients={patients} />}
        </div>
      </div>

      {selectedPatient && (
        <PatientDetail
          patient={selectedPatient}
          onClose={() => setSelectedId(null)}
          onUpdate={(patch) => updatePatient(selectedPatient.id, patch)}
        />
      )}

      {showNewPatient && (
        <NewPatientModal
          onClose={() => setShowNewPatient(false)}
          onSave={(p) => {
            addPatient(p);
            setShowNewPatient(false);
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Sidebar
--------------------------------------------------------- */
function Sidebar({ view, setView, onNewPatient, mobileOpen, onClose }) {
  const items = [
    { id: "dashboard", label: "Painel", icon: LayoutDashboard },
    { id: "patients", label: "Pacientes", icon: Users },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "followups", label: "Follow-up", icon: CheckSquare },
    { id: "financeiro", label: "Financeiro", icon: DollarSign }
  ];
  return (
    <div className={`sidebar${mobileOpen ? " mobile-open" : ""}`} style={styles.sidebar}>
      <div style={{ ...styles.logo, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GrowthMark />
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: "#16332E" }}>
              Crescer
            </div>
            <div style={{ fontSize: 11, color: "#8C99A6", letterSpacing: 0.4 }}>Nutrição Pediátrica</div>
          </div>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          style={{ display: "none", background: "none", border: "none", color: "#4B615D", padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      <button style={styles.newBtn} onClick={onNewPatient}>
        <Plus size={16} /> Novo paciente
      </button>

      <nav style={{ marginTop: 18 }}>
        {items.map((it) => {
          const Icon = it.icon;
          const active = view === it.id;
          return (
            <div
              key={it.id}
              onClick={() => setView(it.id)}
              style={{
                ...styles.navItem,
                background: active ? "#16332E" : "transparent",
                color: active ? "#FBFBF8" : "#4B615D"
              }}
            >
              <Icon size={17} />
              <span>{it.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={styles.sidebarFooter}>
        Jornada da criança, do primeiro contato à alta.
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */
function Header({ query, setQuery, onMenuClick }) {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long"
  });
  return (
    <div style={styles.header} className="header">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
          style={{ background: "none", border: "none", color: "#16332E", padding: 4, flexShrink: 0 }}
        >
          <Menu size={20} />
        </button>
        <div className="header-search" style={{ position: "relative", width: 380, maxWidth: "100%" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "#8C99A6" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, diagnóstico, tag, telefone…"
            style={styles.searchInput}
          />
        </div>
      </div>
      <div className="header-date" style={{ fontSize: 13, color: "#8C99A6", textTransform: "capitalize", flexShrink: 0, marginLeft: 12 }}>{hoje}</div>
    </div>
  );
}

/* ---------------------------------------------------------
   Dashboard
--------------------------------------------------------- */
function Dashboard({ patients, followups, setView, setSelectedId }) {
  const ativos = patients.filter((p) => p.status === "ativo").length;
  const pausa = patients.filter((p) => p.status === "pausa").length;
  const concluidos = patients.filter((p) => p.status === "concluido").length;

  const receitaPrevista = patients.reduce((s, p) => s + (p.acompanhamento?.valor || 0), 0);
  const receitaRecebida = patients.reduce((s, p) => {
    const a = p.acompanhamento;
    if (!a || !a.consultasTotal) return s;
    return s + (a.valor / a.consultasTotal) * a.consultasRealizadas;
  }, 0);
  const receitaPendente = receitaPrevista - receitaRecebida;

  const semContato = patients.filter((p) => {
    const d = diasDesde(p.ultimoContato);
    return d !== null && d >= 21 && p.status === "ativo";
  });

  const followupsPendentes = followups.filter((f) => f.coluna !== "concluido").length;

  const aniversariantes = patients.filter((p) => {
    if (!p.dataNascimento) return false;
    const n = new Date(p.dataNascimento);
    const hoje = new Date();
    const proximo = new Date(hoje.getFullYear(), n.getMonth(), n.getDate());
    const diff = (proximo - hoje) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const evolucaoPacientes = [
    { mes: "Mar", pacientes: 18 }, { mes: "Abr", pacientes: 21 },
    { mes: "Mai", pacientes: 24 }, { mes: "Jun", pacientes: 27 },
    { mes: "Jul", pacientes: patients.length + 24 }
  ];

  const receitaMensal = [
    { mes: "Mar", valor: 8200 }, { mes: "Abr", valor: 9100 },
    { mes: "Mai", valor: 10400 }, { mes: "Jun", valor: 11200 },
    { mes: "Jul", valor: Math.round(receitaRecebida / 1.0) + 6000 }
  ];

  return (
    <div>
      <SectionTitle title="Painel" subtitle="Visão geral da clínica em tempo real" />

      <div style={styles.cardsGrid} className="cards-grid">
        <MetricCard label="Pacientes ativos" value={ativos} icon={Users} accent="#7FAE86" />
        <MetricCard label="Em pausa" value={pausa} icon={Clock} accent="#E8B85E" />
        <MetricCard label="Concluídos" value={concluidos} icon={CheckSquare} accent="#8C99A6" />
        <MetricCard label="Follow-ups pendentes" value={followupsPendentes} icon={MessageCircle} accent="#F2704A"
          onClick={() => setView("followups")} />
        <MetricCard label="Receita prevista" value={formatMoeda(receitaPrevista)} icon={DollarSign} accent="#16332E" />
        <MetricCard label="Receita recebida" value={formatMoeda(receitaRecebida)} icon={TrendingUp} accent="#7FAE86" />
        <MetricCard label="Receita pendente" value={formatMoeda(receitaPendente)} icon={AlertTriangle} accent="#E8B85E" />
        <MetricCard label="Aniversariantes da semana" value={aniversariantes.length} icon={Cake} accent="#F2704A" />
      </div>

      <div style={styles.chartsGrid} className="charts-grid">
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Evolução do número de pacientes</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evolucaoPacientes}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7FAE86" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7FAE86" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EDEAE0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#8C99A6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8C99A6" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #EDEAE0", fontSize: 13 }} />
              <Area type="monotone" dataKey="pacientes" stroke="#7FAE86" fill="url(#grad1)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>Receita mensal</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={receitaMensal}>
              <CartesianGrid stroke="#EDEAE0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#8C99A6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8C99A6" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => formatMoeda(v)} contentStyle={{ borderRadius: 8, border: "1px solid #EDEAE0", fontSize: 13 }} />
              <Bar dataKey="valor" fill="#16332E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelTitle}>Pacientes sem contato há 21+ dias</div>
        {semContato.length === 0 ? (
          <div style={styles.emptyRow}>Nenhum paciente ativo nessa situação. Tudo em dia.</div>
        ) : (
          semContato.map((p) => (
            <div key={p.id} style={styles.riskRow} onClick={() => setSelectedId(p.id)}>
              <div>
                <div style={{ fontWeight: 600, color: "#16332E" }}>{p.nome}</div>
                <div style={{ fontSize: 12, color: "#8C99A6" }}>{p.diagnostico}</div>
              </div>
              <div style={{ fontSize: 12, color: "#F2704A", fontWeight: 600 }}>
                {diasDesde(p.ultimoContato)} dias sem contato
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, accent, onClick }) {
  return (
    <div style={{ ...styles.metricCard, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <div style={{ ...styles.metricIcon, background: accent + "1A", color: accent }}>
        <Icon size={17} />
      </div>
      <div>
        <div style={styles.metricValue}>{value}</div>
        <div style={styles.metricLabel}>{label}</div>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
      <div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 600, color: "#16332E" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: "#8C99A6", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

/* ---------------------------------------------------------
   Lista de pacientes
--------------------------------------------------------- */
function PatientsList({ patients, onOpen, onNew }) {
  return (
    <div>
      <SectionTitle
        title="Pacientes"
        subtitle={`${patients.length} pacientes encontrados`}
        action={
          <button style={styles.primaryBtn} onClick={onNew}>
            <Plus size={16} /> Novo paciente
          </button>
        }
      />
      <div style={styles.panel}>
        <div style={styles.tableHeader} className="table-header">
          <div style={{ flex: 2 }}>Paciente</div>
          <div style={{ flex: 1.4 }}>Diagnóstico</div>
          <div style={{ flex: 1 }}>Responsável</div>
          <div style={{ flex: 1 }}>Status</div>
          <div style={{ flex: 1 }}>Acompanhamento</div>
          <div style={{ width: 24 }} />
        </div>
        {patients.map((p) => (
          <div key={p.id} style={styles.tableRow} className="table-row" onClick={() => onOpen(p.id)}>
            <div style={{ flex: 2 }}>
              <div style={{ fontWeight: 600, color: "#16332E" }}>{p.nome}</div>
              <div style={{ fontSize: 12, color: "#8C99A6" }}>{calcIdade(p.dataNascimento)}</div>
            </div>
            <div style={{ flex: 1.4, fontSize: 13, color: "#4B615D" }} data-label="Diagnóstico">{p.diagnostico}</div>
            <div style={{ flex: 1, fontSize: 13, color: "#4B615D" }} data-label="Responsável">{p.responsavel}</div>
            <div style={{ flex: 1 }} data-label="Status">
              <StatusPill status={p.status} />
            </div>
            <div style={{ flex: 1, fontSize: 13, color: "#4B615D" }} data-label="Acompanhamento">
              {p.acompanhamento?.consultasRealizadas}/{p.acompanhamento?.consultasTotal} · {p.acompanhamento?.tipo}
            </div>
            <div className="chevron-col" style={{ width: 24, color: "#8C99A6" }}><ChevronRight size={16} /></div>
          </div>
        ))}
        {patients.length === 0 && <div style={styles.emptyRow}>Nenhum paciente encontrado para essa busca.</div>}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
      background: STATUS_COLOR[status] + "1F", color: STATUS_COLOR[status]
    }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ---------------------------------------------------------
   Detalhe do paciente
--------------------------------------------------------- */
function PatientDetail({ patient, onClose, onUpdate }) {
  const [tab, setTab] = useState("dados");
  const tabs = [
    { id: "dados", label: "Dados", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "evolucao", label: "Evolução clínica", icon: Activity },
    { id: "acompanhamento", label: "Acompanhamento", icon: Stethoscope }
  ];

  const evolucaoChart = (patient.evolucao || []).map((e) => ({
    data: formatData(e.data).slice(0, 5),
    peso: e.peso,
    imc: Number(calcIMC(e.peso, e.altura))
  }));

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} className="drawer" onClick={(e) => e.stopPropagation()}>
        <div style={styles.drawerHeader} className="drawer-header">
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: "#16332E" }}>
              {patient.nome}
            </div>
            <div style={{ fontSize: 13, color: "#8C99A6", marginTop: 2 }}>
              {calcIdade(patient.dataNascimento)} · {patient.diagnostico}
            </div>
          </div>
          <button style={styles.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div className="drawer-tabs" style={{ display: "flex", gap: 6, padding: "0 24px", borderBottom: "1px solid #EDEAE0" }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <div key={t.id} onClick={() => setTab(t.id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 12px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                color: active ? "#16332E" : "#8C99A6",
                borderBottom: active ? "2px solid #16332E" : "2px solid transparent"
              }}>
                <Icon size={14} /> {t.label}
              </div>
            );
          })}
        </div>

        <div className="drawer-body" style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {tab === "dados" && (
            <div>
              <InfoGrid items={[
                ["Data de nascimento", formatData(patient.dataNascimento)],
                ["Sexo", patient.sexo === "F" ? "Feminino" : "Masculino"],
                ["Escola", patient.escola],
                ["Alergias", patient.alergias],
                ["Medicamentos", patient.medicamentos],
                ["Pediatra", patient.pediatra]
              ]} />
              <div style={styles.divider} />
              <div style={styles.miniTitle}>Contato e responsável</div>
              <InfoGrid items={[
                ["Responsável", patient.responsavel],
                ["Telefone", patient.telefone],
                ["WhatsApp", patient.whatsapp],
                ["E-mail", patient.email],
                ["Endereço", patient.endereco]
              ]} />
              <div style={styles.divider} />
              <div style={styles.miniTitle}>Tags</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(patient.tags || []).map((t) => (
                  <span key={t} style={styles.tagPill}><TagIcon size={11} /> {t}</span>
                ))}
              </div>
            </div>
          )}

          {tab === "timeline" && (
            <div>
              {(patient.timeline || []).slice().reverse().map((ev, i) => (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timelineDot} />
                  <div>
                    <div style={{ fontSize: 12, color: "#8C99A6" }}>{formatData(ev.data)} · {ev.tipo}</div>
                    <div style={{ fontSize: 14, color: "#16332E" }}>{ev.texto}</div>
                  </div>
                </div>
              ))}
              {(!patient.timeline || patient.timeline.length === 0) && (
                <div style={styles.emptyRow}>Nenhum evento registrado ainda.</div>
              )}
            </div>
          )}

          {tab === "evolucao" && (
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={evolucaoChart}>
                  <CartesianGrid stroke="#EDEAE0" vertical={false} />
                  <XAxis dataKey="data" tick={{ fontSize: 11, fill: "#8C99A6" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8C99A6" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #EDEAE0", fontSize: 12 }} />
                  <Line type="monotone" dataKey="peso" stroke="#7FAE86" strokeWidth={2.5} dot={{ r: 3 }} name="Peso (kg)" />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12 }}>
                {(patient.evolucao || []).slice().reverse().map((e, i) => (
                  <div key={i} style={styles.evoRow} className="evo-row">
                    <div style={{ fontSize: 12, color: "#8C99A6", width: 90 }}>{formatData(e.data)}</div>
                    <div style={{ fontSize: 13, color: "#16332E", width: 70 }}>{e.peso} kg</div>
                    <div style={{ fontSize: 13, color: "#16332E", width: 70 }}>{e.altura} cm</div>
                    <div style={{ fontSize: 13, color: "#16332E", width: 70 }}>IMC {calcIMC(e.peso, e.altura)}</div>
                    <div style={{ fontSize: 13, color: "#4B615D", flex: 1 }}>{e.obs}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "acompanhamento" && patient.acompanhamento && (
            <div>
              <InfoGrid items={[
                ["Tipo de plano", patient.acompanhamento.tipo],
                ["Início", formatData(patient.acompanhamento.dataInicio)],
                ["Fim previsto", formatData(patient.acompanhamento.dataFim)],
                ["Consultas", `${patient.acompanhamento.consultasRealizadas} de ${patient.acompanhamento.consultasTotal}`],
                ["Valor total", formatMoeda(patient.acompanhamento.valor)],
                ["Forma de pagamento", `${patient.acompanhamento.formaPagamento} · ${patient.acompanhamento.parcelas}x`]
              ]} />
              <div style={styles.divider} />
              <div style={styles.miniTitle}>Status do acompanhamento</div>
              <StatusPill status={patient.status} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
      {items.map(([label, value]) => (
        <div key={label}>
          <div style={{ fontSize: 11, color: "#8C99A6", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
          <div style={{ fontSize: 14, color: "#16332E", marginTop: 2 }}>{value || "-"}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Novo paciente
--------------------------------------------------------- */
function NewPatientModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    nome: "", dataNascimento: "", sexo: "F", escola: "", diagnostico: "",
    alergias: "", medicamentos: "", pediatra: "", responsavel: "",
    telefone: "", whatsapp: "", email: "", endereco: "", tags: "",
    status: "ativo", ultimoContato: new Date().toISOString().slice(0, 10)
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.nome.trim()) return;
    onSave({
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      evolucao: [],
      timeline: [{ data: new Date().toISOString().slice(0, 10), tipo: "nota", texto: "Paciente cadastrado no sistema." }],
      acompanhamento: {
        tipo: "Consulta avulsa", dataInicio: new Date().toISOString().slice(0, 10),
        dataFim: "", consultasTotal: 1, consultasRealizadas: 0, valor: 0,
        formaPagamento: "Pix", parcelas: 1, status: "ativo"
      }
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={styles.drawerHeader} className="drawer-header">
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 600, color: "#16332E" }}>
            Novo paciente
          </div>
          <button style={styles.iconBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div className="new-patient-grid" style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, overflowY: "auto" }}>
          <Field label="Nome da criança" value={form.nome} onChange={(v) => set("nome", v)} full />
          <Field label="Data de nascimento" type="date" value={form.dataNascimento} onChange={(v) => set("dataNascimento", v)} />
          <Field label="Sexo" type="select" options={["F", "M"]} value={form.sexo} onChange={(v) => set("sexo", v)} />
          <Field label="Diagnóstico" value={form.diagnostico} onChange={(v) => set("diagnostico", v)} full />
          <Field label="Alergias" value={form.alergias} onChange={(v) => set("alergias", v)} />
          <Field label="Medicamentos" value={form.medicamentos} onChange={(v) => set("medicamentos", v)} />
          <Field label="Escola" value={form.escola} onChange={(v) => set("escola", v)} />
          <Field label="Pediatra" value={form.pediatra} onChange={(v) => set("pediatra", v)} />
          <Field label="Responsável" value={form.responsavel} onChange={(v) => set("responsavel", v)} full />
          <Field label="Telefone" value={form.telefone} onChange={(v) => set("telefone", v)} />
          <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
          <Field label="E-mail" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Endereço" value={form.endereco} onChange={(v) => set("endereco", v)} />
          <Field label="Tags (separadas por vírgula)" value={form.tags} onChange={(v) => set("tags", v)} full />
        </div>
        <div className="modal-footer" style={{ padding: "16px 24px", borderTop: "1px solid #EDEAE0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={styles.secondaryBtn} onClick={onClose}>Cancelar</button>
          <button style={styles.primaryBtn} onClick={submit}>Salvar paciente</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", options, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <div style={{ fontSize: 11, color: "#8C99A6", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      {type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Agenda
--------------------------------------------------------- */
function Agenda({ patients }) {
  const eventos = patients
    .filter((p) => p.acompanhamento?.dataFim)
    .map((p) => ({
      nome: p.nome,
      data: p.acompanhamento.dataInicio,
      tipo: "Retorno agendado",
      status: p.status
    }))
    .sort((a, b) => new Date(a.data) - new Date(b.data));

  const porData = eventos.reduce((acc, e) => {
    acc[e.data] = acc[e.data] || [];
    acc[e.data].push(e);
    return acc;
  }, {});

  return (
    <div>
      <SectionTitle title="Agenda" subtitle="Consultas e retornos por data" />
      <div style={styles.panel}>
        {Object.keys(porData).length === 0 && <div style={styles.emptyRow}>Nenhum evento agendado.</div>}
        {Object.entries(porData).map(([data, lista]) => (
          <div key={data} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#16332E", marginBottom: 8 }}>
              {new Date(data + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
            </div>
            {lista.map((e, i) => (
              <div key={i} style={styles.agendaRow} className="agenda-row">
                <Calendar size={15} color="#7FAE86" />
                <div className="agenda-name" style={{ fontWeight: 600, color: "#16332E", width: 180 }}>{e.nome}</div>
                <div style={{ fontSize: 13, color: "#4B615D" }}>{e.tipo}</div>
                <StatusPill status={e.status} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Follow-up (Kanban)
--------------------------------------------------------- */
function FollowupsBoard({ followups, patients, onMove }) {
  const patientName = (id) => patients.find((p) => p.id === id)?.nome || "—";

  return (
    <div>
      <SectionTitle title="Follow-up" subtitle="Tarefas de relacionamento e cobrança" />
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
        {KANBAN_COLS.map((col) => {
          const items = followups.filter((f) => f.coluna === col.id);
          return (
            <div key={col.id} style={styles.kanbanCol} className="kanban-col">
              <div style={styles.kanbanColHeader}>
                {col.label} <span style={{ color: "#8C99A6", fontWeight: 400 }}>({items.length})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((f) => (
                  <div key={f.id} style={styles.kanbanCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#16332E" }}>{f.titulo}</div>
                      <span style={{ width: 8, height: 8, borderRadius: 8, background: PRIORIDADE_COLOR[f.prioridade], marginTop: 4 }} />
                    </div>
                    <div style={{ fontSize: 12, color: "#8C99A6", marginTop: 4 }}>{patientName(f.pacienteId)}</div>
                    <div style={{ fontSize: 11, color: "#8C99A6", marginTop: 6 }}>
                      Prazo {formatData(f.prazo)} · {f.responsavel}
                    </div>
                    <select
                      value={f.coluna}
                      onChange={(e) => onMove(f.id, e.target.value)}
                      style={styles.kanbanSelect}
                    >
                      {KANBAN_COLS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: 12, color: "#C4C0B4", padding: "8px 0" }}>Sem tarefas</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Financeiro
--------------------------------------------------------- */
function Financeiro({ patients }) {
  const rows = patients.map((p) => {
    const a = p.acompanhamento || {};
    const recebido = a.consultasTotal ? (a.valor / a.consultasTotal) * a.consultasRealizadas : 0;
    return { ...p, recebido, pendente: (a.valor || 0) - recebido };
  });

  const totalPrevisto = rows.reduce((s, r) => s + (r.acompanhamento?.valor || 0), 0);
  const totalRecebido = rows.reduce((s, r) => s + r.recebido, 0);
  const totalPendente = totalPrevisto - totalRecebido;

  return (
    <div>
      <SectionTitle title="Financeiro" subtitle="Planos, pagamentos e inadimplência" />
      <div style={styles.cardsGrid} className="cards-grid">
        <MetricCard label="Receita prevista" value={formatMoeda(totalPrevisto)} icon={DollarSign} accent="#16332E" />
        <MetricCard label="Receita recebida" value={formatMoeda(totalRecebido)} icon={TrendingUp} accent="#7FAE86" />
        <MetricCard label="Receita pendente" value={formatMoeda(totalPendente)} icon={AlertTriangle} accent="#E8B85E" />
      </div>
      <div style={styles.panel}>
        <div style={styles.tableHeader} className="table-header">
          <div style={{ flex: 2 }}>Paciente</div>
          <div style={{ flex: 1 }}>Plano</div>
          <div style={{ flex: 1 }}>Pagamento</div>
          <div style={{ flex: 1 }}>Recebido</div>
          <div style={{ flex: 1 }}>Pendente</div>
          <div style={{ flex: 1 }}>Status</div>
        </div>
        {rows.map((r) => (
          <div key={r.id} style={styles.tableRow} className="table-row">
            <div style={{ flex: 2, fontWeight: 600, color: "#16332E" }}>{r.nome}</div>
            <div style={{ flex: 1, fontSize: 13, color: "#4B615D" }} data-label="Plano">{r.acompanhamento?.tipo}</div>
            <div style={{ flex: 1, fontSize: 13, color: "#4B615D" }} data-label="Pagamento">{r.acompanhamento?.formaPagamento} · {r.acompanhamento?.parcelas}x</div>
            <div style={{ flex: 1, fontSize: 13, color: "#7FAE86", fontWeight: 600 }} data-label="Recebido">{formatMoeda(r.recebido)}</div>
            <div style={{ flex: 1, fontSize: 13, color: "#F2704A", fontWeight: 600 }} data-label="Pendente">{formatMoeda(r.pendente)}</div>
            <div style={{ flex: 1 }} data-label="Status"><StatusPill status={r.status} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Estilos
--------------------------------------------------------- */
const styles = {
  root: {
    display: "flex", minHeight: "100vh", background: "#FBFBF8",
    fontFamily: "Inter, sans-serif", color: "#16332E"
  },
  sidebar: {
    width: 230, background: "#FFFFFF", borderRight: "1px solid #EDEAE0",
    padding: "22px 18px", display: "flex", flexDirection: "column", flexShrink: 0
  },
  logo: { display: "flex", alignItems: "center", gap: 10, paddingBottom: 4 },
  newBtn: {
    marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    background: "#16332E", color: "#FBFBF8", border: "none", borderRadius: 8,
    padding: "10px 12px", fontSize: 13, fontWeight: 600
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
    borderRadius: 8, fontSize: 13.5, fontWeight: 500, marginBottom: 3, cursor: "pointer"
  },
  sidebarFooter: {
    marginTop: "auto", fontSize: 11.5, color: "#8C99A6", lineHeight: 1.5,
    borderTop: "1px solid #EDEAE0", paddingTop: 14
  },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 28px", borderBottom: "1px solid #EDEAE0", background: "#FFFFFF"
  },
  searchInput: {
    width: "100%", padding: "9px 12px 9px 34px", borderRadius: 8,
    border: "1px solid #EDEAE0", fontSize: 13, outline: "none", background: "#FBFBF8"
  },
  content: { padding: 28, overflowY: "auto", flex: 1 },
  cardsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22
  },
  metricCard: {
    background: "#FFFFFF", border: "1px solid #EDEAE0", borderRadius: 12,
    padding: 16, display: "flex", alignItems: "center", gap: 12
  },
  metricIcon: {
    width: 36, height: 36, borderRadius: 9, display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0
  },
  metricValue: { fontSize: 19, fontWeight: 700, color: "#16332E", lineHeight: 1.2 },
  metricLabel: { fontSize: 12, color: "#8C99A6", marginTop: 1 },
  chartsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 },
  panel: {
    background: "#FFFFFF", border: "1px solid #EDEAE0", borderRadius: 12,
    padding: 20, marginBottom: 14
  },
  panelTitle: { fontSize: 14, fontWeight: 700, color: "#16332E", marginBottom: 12 },
  emptyRow: { fontSize: 13, color: "#8C99A6", padding: "10px 0" },
  riskRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #F4F2EB", cursor: "pointer"
  },
  tableHeader: {
    display: "flex", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4,
    color: "#8C99A6", padding: "0 0 10px", borderBottom: "1px solid #EDEAE0", marginBottom: 4
  },
  tableRow: {
    display: "flex", alignItems: "center", padding: "13px 0",
    borderBottom: "1px solid #F4F2EB", cursor: "pointer"
  },
  primaryBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "#16332E", color: "#FBFBF8",
    border: "none", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 600
  },
  secondaryBtn: {
    background: "#FFFFFF", color: "#16332E", border: "1px solid #EDEAE0",
    borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 600
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(22,51,46,0.35)",
    display: "flex", justifyContent: "flex-end", zIndex: 50
  },
  drawer: {
    width: 640, maxWidth: "94vw", background: "#FBFBF8", height: "100%",
    display: "flex", flexDirection: "column", boxShadow: "-8px 0 24px rgba(0,0,0,0.08)"
  },
  drawerHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "20px 24px", borderBottom: "1px solid #EDEAE0", background: "#FFFFFF"
  },
  iconBtn: {
    background: "#F4F2EB", border: "none", borderRadius: 8, padding: 7,
    display: "flex", color: "#4B615D"
  },
  divider: { height: 1, background: "#EDEAE0", margin: "18px 0" },
  miniTitle: { fontSize: 11, color: "#8C99A6", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 },
  tagPill: {
    display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5,
    background: "#F4F2EB", color: "#4B615D", padding: "4px 9px", borderRadius: 20
  },
  timelineItem: { display: "flex", gap: 12, paddingBottom: 18, position: "relative" },
  timelineDot: {
    width: 8, height: 8, borderRadius: 8, background: "#7FAE86", marginTop: 5, flexShrink: 0
  },
  evoRow: {
    display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F4F2EB"
  },
  modal: {
    margin: "auto", width: 620, maxWidth: "94vw", maxHeight: "88vh", background: "#FBFBF8",
    borderRadius: 14, display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
  },
  input: {
    width: "100%", padding: "9px 11px", borderRadius: 8, border: "1px solid #EDEAE0",
    fontSize: 13.5, outline: "none", background: "#FFFFFF"
  },
  agendaRow: {
    display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid #F4F2EB"
  },
  kanbanCol: {
    background: "#F4F2EB", borderRadius: 12, padding: 12, width: 240, flexShrink: 0, minHeight: 300
  },
  kanbanColHeader: { fontSize: 12.5, fontWeight: 700, color: "#16332E", marginBottom: 10 },
  kanbanCard: {
    background: "#FFFFFF", border: "1px solid #EDEAE0", borderRadius: 10, padding: 10
  },
  kanbanSelect: {
    marginTop: 8, width: "100%", fontSize: 11, padding: "5px 6px", borderRadius: 6,
    border: "1px solid #EDEAE0", background: "#FBFBF8", color: "#4B615D"
  }
};
