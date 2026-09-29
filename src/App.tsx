import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Group,
  Indicator,
  Menu,
  Modal,
  NavLink,
  Paper,
  Progress,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAdjustments,
  IconBell,
  IconBrandGoogleFilled,
  IconCalendarEvent,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardCheck,
  IconClock,
  IconDots,
  IconFileDescription,
  IconFlask,
  IconHeartbeat,
  IconHome2,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMedicalCross,
  IconMessageCircle,
  IconNotes,
  IconPlus,
  IconPrescription,
  IconSearch,
  IconSettings,
  IconStethoscope,
  IconUser,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import PatientWorkspace, { type PatientTab } from './PatientWorkspace';

type Screen = 'dashboard' | 'agenda' | 'patients' | 'patient-detail' | 'encounter' | 'orders' | 'settings';

type Patient = {
  id: string;
  initials: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  nextVisit: string;
  condition: string;
  status: 'Activo' | 'Seguimiento' | 'Nuevo';
  color: string;
};

const patients: Patient[] = [
  { id: 'PA-1048', initials: 'AM', name: 'Ana María López', age: 42, gender: 'Femenino', phone: '+505 8854 3172', lastVisit: '24 sep 2026', nextVisit: 'Hoy, 10:30', condition: 'Hipertensión esencial', status: 'Seguimiento', color: '#9c36b5' },
  { id: 'PA-1021', initials: 'JR', name: 'José Ramón Pérez', age: 58, gender: 'Masculino', phone: '+505 7712 4408', lastVisit: '18 sep 2026', nextVisit: 'Hoy, 11:15', condition: 'Diabetes mellitus tipo 2', status: 'Activo', color: '#2f9e44' },
  { id: 'PA-1083', initials: 'SC', name: 'Sofía Castillo', age: 29, gender: 'Femenino', phone: '+505 8960 2216', lastVisit: '12 sep 2026', nextVisit: 'Mañana, 09:00', condition: 'Control prenatal', status: 'Activo', color: '#1971c2' },
  { id: 'PA-1092', initials: 'DM', name: 'Daniel Mendoza', age: 35, gender: 'Masculino', phone: '+505 8425 7601', lastVisit: 'Primera visita', nextVisit: 'Mañana, 10:30', condition: 'Evaluación inicial', status: 'Nuevo', color: '#e8590c' },
  { id: 'PA-0977', initials: 'LR', name: 'Lucía Rivas', age: 64, gender: 'Femenino', phone: '+505 7750 9134', lastVisit: '2 sep 2026', nextVisit: '30 sep, 14:00', condition: 'Artritis reumatoide', status: 'Seguimiento', color: '#6741d9' },
  { id: 'PA-1065', initials: 'CM', name: 'Carlos Mejía', age: 47, gender: 'Masculino', phone: '+505 8981 0035', lastVisit: '27 ago 2026', nextVisit: '3 oct, 08:30', condition: 'Dislipidemia', status: 'Activo', color: '#0b7285' },
];

const appointments = [
  { time: '08:00', name: 'María Fernanda Silva', reason: 'Control prenatal', type: 'Presencial', status: 'Finalizada', avatar: 'MF', color: '#1971c2' },
  { time: '09:00', name: 'Ricardo Gutiérrez', reason: 'Dolor lumbar', type: 'Presencial', status: 'En consulta', avatar: 'RG', color: '#2f9e44' },
  { time: '10:30', name: 'Ana María López', reason: 'Control de presión arterial', type: 'Presencial', status: 'Confirmada', avatar: 'AM', color: '#9c36b5' },
  { time: '11:15', name: 'José Ramón Pérez', reason: 'Seguimiento metabólico', type: 'Videollamada', status: 'Confirmada', avatar: 'JR', color: '#e8590c' },
  { time: '13:30', name: 'Mariela Brenes', reason: 'Resultados de laboratorio', type: 'Presencial', status: 'Pendiente', avatar: 'MB', color: '#6741d9' },
  { time: '15:00', name: 'Esteban Rocha', reason: 'Consulta general', type: 'Presencial', status: 'Confirmada', avatar: 'ER', color: '#0b7285' },
];

const navigation: Array<{ screen: Screen; label: string; icon: typeof IconHome2 }> = [
  { screen: 'dashboard', label: 'Espacios', icon: IconHome2 },
  { screen: 'patients', label: 'Pacientes', icon: IconUsers },
  { screen: 'agenda', label: 'Agenda', icon: IconCalendarEvent },
  { screen: 'encounter', label: 'Consulta', icon: IconStethoscope },
  { screen: 'orders', label: 'Resultados', icon: IconFlask },
];

const screenTitles: Record<Screen, { title: string; description: string }> = {
  dashboard: { title: 'Buenos días, Dra. Ortega', description: 'Resumen de la operación clínica para hoy.' },
  agenda: { title: 'Agenda', description: 'Domingo, 28 de septiembre de 2026' },
  patients: { title: 'Pacientes', description: 'Directorio clínico y seguimiento activo.' },
  'patient-detail': { title: 'Historia clínica', description: 'Expediente longitudinal del paciente.' },
  encounter: { title: 'Consulta clínica', description: 'Documenta hallazgos, evaluación y plan.' },
  orders: { title: 'Resultados y órdenes', description: 'Seguimiento de estudios y documentos clínicos.' },
  settings: { title: 'Configuración', description: 'Preferencias de la clínica y del equipo.' },
};

function statusColor(status: string) {
  if (status === 'Finalizada' || status === 'Activo' || status === 'Disponible') return 'green';
  if (status === 'En consulta' || status === 'Seguimiento' || status === 'Revisar') return 'grape';
  if (status === 'Nuevo' || status === 'Pendiente') return 'orange';
  return 'blue';
}

function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Group justify="space-between" align="flex-start" gap="md" wrap="nowrap">
      <Box>
        <Title order={2}>{title}</Title>
        {description && <Text c="dimmed" size="sm" mt={3}>{description}</Text>}
      </Box>
      {action}
    </Group>
  );
}

function Metric({ label, value, detail, icon, color = 'blue' }: { label: string; value: string; detail: string; icon: ReactNode; color?: string }) {
  return (
    <Paper className="metric-panel" withBorder shadow="sm">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Box>
          <Text size="xs" c="dimmed" fw={500}>{label}</Text>
          <Text className="metric-value">{value}</Text>
          <Text size="xs" c="dimmed">{detail}</Text>
        </Box>
        <ThemeIcon size={36} variant="light" color={color} radius="sm">{icon}</ThemeIcon>
      </Group>
    </Paper>
  );
}

function TodayAgenda({ onOpenPatient }: { onOpenPatient: () => void }) {
  return (
    <Paper withBorder shadow="sm" className="content-panel">
      <Group justify="space-between" mb="md">
        <Box>
          <Title order={3}>Agenda de hoy</Title>
          <Text size="xs" c="dimmed">6 citas, 1 en curso</Text>
        </Box>
        <Button variant="subtle" size="compact-sm" rightSection={<IconChevronRight size={15} />}>Ver agenda</Button>
      </Group>
      <Stack gap={0} className="agenda-list">
        {appointments.slice(0, 4).map((appointment) => (
          <UnstyledButton key={`${appointment.time}-${appointment.name}`} className="agenda-row" onClick={appointment.name === 'Ana María López' ? onOpenPatient : undefined}>
            <Text className="agenda-time">{appointment.time}</Text>
            <Avatar color={appointment.color} radius="sm" size={34}>{appointment.avatar}</Avatar>
            <Box className="agenda-person">
              <Text size="sm" fw={600}>{appointment.name}</Text>
              <Text size="xs" c="dimmed" lineClamp={1}>{appointment.reason}</Text>
            </Box>
            <Badge color={statusColor(appointment.status)} variant="light" radius="sm">{appointment.status}</Badge>
          </UnstyledButton>
        ))}
      </Stack>
    </Paper>
  );
}

function DashboardScreen({ onOpenPatient, onNavigate }: { onOpenPatient: () => void; onNavigate: (screen: Screen) => void }) {
  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
        <Metric label="Citas de hoy" value="6" detail="5 confirmadas" icon={<IconCalendarEvent size={19} />} />
        <Metric label="En espera" value="2" detail="Promedio 8 min" icon={<IconClock size={19} />} color="orange" />
        <Metric label="Pacientes activos" value="286" detail="12 nuevos este mes" icon={<IconUsers size={19} />} color="blue" />
        <Metric label="Resultados pendientes" value="4" detail="2 requieren revisión" icon={<IconFlask size={19} />} color="red" />
      </SimpleGrid>

      <div className="dashboard-grid">
        <TodayAgenda onOpenPatient={onOpenPatient} />
        <Paper withBorder shadow="sm" className="content-panel">
          <Title order={3}>Flujo de atención</Title>
          <Text size="xs" c="dimmed" mb="lg">Estado actual de la jornada</Text>
          <Stack gap="lg">
            {[
              ['Confirmadas', 5, 83, 'grape'],
              ['Atendidas', 2, 33, 'green'],
              ['En espera', 2, 28, 'orange'],
            ].map(([label, value, progress, color]) => (
              <Box key={String(label)}>
                <Group justify="space-between" mb={6}>
                  <Text size="sm" fw={500}>{label}</Text>
                  <Text size="sm" fw={600}>{value}</Text>
                </Group>
                <Progress value={Number(progress)} color={String(color)} size={6} radius="xs" />
              </Box>
            ))}
          </Stack>
          <Divider my="lg" />
          <Button fullWidth variant="light" leftSection={<IconChartBar size={17} />}>Abrir informe diario</Button>
        </Paper>
      </div>

      <div className="dashboard-grid secondary-grid">
        <Paper withBorder shadow="sm" className="content-panel">
          <Group justify="space-between" mb="md">
            <Box>
              <Title order={3}>Tareas clínicas</Title>
              <Text size="xs" c="dimmed">Prioridades para completar hoy</Text>
            </Box>
            <ActionIcon variant="subtle" aria-label="Más opciones"><IconDots size={18} /></ActionIcon>
          </Group>
          <Stack gap={0}>
            {[
              ['Revisar hemograma de Mariela Brenes', 'Resultado recibido hace 18 min', true],
              ['Firmar nota clínica de Ricardo Gutiérrez', 'Consulta de las 09:00', false],
              ['Enviar plan de cuidado a José Ramón Pérez', 'Pendiente desde ayer', false],
            ].map(([title, meta, checked]) => (
              <Group key={String(title)} className="task-row" wrap="nowrap">
                <Checkbox defaultChecked={Boolean(checked)} radius="xs" />
                <Box>
                  <Text size="sm" fw={500} td={checked ? 'line-through' : undefined} c={checked ? 'dimmed' : undefined}>{title}</Text>
                  <Text size="xs" c="dimmed">{meta}</Text>
                </Box>
              </Group>
            ))}
          </Stack>
        </Paper>
        <Paper withBorder shadow="sm" className="content-panel quick-actions">
          <Title order={3}>Acciones rápidas</Title>
          <Text size="xs" c="dimmed" mb="md">Accesos frecuentes</Text>
          <SimpleGrid cols={2} spacing="sm">
            <Button variant="default" leftSection={<IconCalendarEvent size={17} />} onClick={() => onNavigate('agenda')}>Nueva cita</Button>
            <Button variant="default" leftSection={<IconUser size={17} />} onClick={() => onNavigate('patients')}>Paciente</Button>
            <Button variant="default" leftSection={<IconNotes size={17} />} onClick={() => onNavigate('encounter')}>Consulta</Button>
            <Button variant="default" leftSection={<IconPrescription size={17} />} onClick={() => onNavigate('orders')}>Orden</Button>
          </SimpleGrid>
        </Paper>
      </div>
    </Stack>
  );
}

function AgendaScreen({ onNewAppointment, onOpenPatient }: { onNewAppointment: () => void; onOpenPatient: () => void }) {
  const [view, setView] = useState('Día');
  const days = ['Dom 28', 'Lun 29', 'Mar 30', 'Mié 1', 'Jue 2'];
  return (
    <Stack gap="md">
      <Paper withBorder shadow="sm" className="toolbar-panel">
        <Group justify="space-between" gap="md">
          <Group gap="xs">
            <ActionIcon variant="default" aria-label="Día anterior"><IconChevronLeft size={17} /></ActionIcon>
            <Button variant="default" size="sm">Hoy</Button>
            <ActionIcon variant="default" aria-label="Día siguiente"><IconChevronRight size={17} /></ActionIcon>
            <Text fw={600} ml="sm">28 sep - 2 oct 2026</Text>
          </Group>
          <Group gap="sm">
            <SegmentedControl value={view} onChange={setView} data={['Día', 'Semana']} size="xs" />
            <Button leftSection={<IconPlus size={16} />} onClick={onNewAppointment}>Nueva cita</Button>
          </Group>
        </Group>
      </Paper>
      <div className="schedule-layout">
        <Paper withBorder shadow="sm" className="calendar-panel">
          <div className="week-header">
            <div />
            {days.map((day, index) => <div key={day} className={index === 0 ? 'selected-day' : ''}><Text size="xs" c="dimmed">{day.split(' ')[0]}</Text><Text fw={600}>{day.split(' ')[1]}</Text></div>)}
          </div>
          <div className="week-grid">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
              <div className="time-row" key={time}>
                <Text size="xs" c="dimmed">{time}</Text>
                {days.map((day, dayIndex) => <div className="time-cell" key={`${day}-${time}`} />)}
              </div>
            ))}
          </div>
          <button className="calendar-event event-a" onClick={onOpenPatient}><span>10:30</span><strong>Ana María López</strong><small>Control de presión</small></button>
          <button className="calendar-event event-b"><span>09:00</span><strong>Ricardo Gutiérrez</strong><small>Dolor lumbar</small></button>
          <button className="calendar-event event-c"><span>11:15</span><strong>José Ramón Pérez</strong><small>Videollamada</small></button>
          <button className="calendar-event event-d"><span>14:00</span><strong>Lucía Rivas</strong><small>Seguimiento</small></button>
        </Paper>
        <Paper withBorder shadow="sm" className="content-panel schedule-summary">
          <Title order={3}>Domingo 28</Title>
          <Text size="xs" c="dimmed" mb="md">6 citas programadas</Text>
          <Stack gap="xs">
            {appointments.map((appointment) => (
              <UnstyledButton key={appointment.time} className="compact-appointment" onClick={appointment.name === 'Ana María López' ? onOpenPatient : undefined}>
                <Text className="compact-time">{appointment.time}</Text>
                <Box>
                  <Text size="xs" fw={600}>{appointment.name}</Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>{appointment.reason}</Text>
                </Box>
              </UnstyledButton>
            ))}
          </Stack>
        </Paper>
      </div>
    </Stack>
  );
}

function PatientsScreen({ onOpenPatient, onNewPatient }: { onOpenPatient: () => void; onNewPatient: () => void }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string | null>('Todos');
  const filtered = patients.filter((patient) => {
    const matchesQuery = `${patient.name} ${patient.id} ${patient.condition}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'Todos' || patient.status === status);
  });
  return (
    <Paper withBorder shadow="sm" className="content-panel patient-table-panel">
      <Group justify="space-between" mb="md" gap="md">
        <Group gap="sm" className="table-filters">
          <TextInput value={query} onChange={(event) => setQuery(event.currentTarget.value)} leftSection={<IconSearch size={16} />} placeholder="Buscar por nombre, ID o condición" />
          <Select value={status} onChange={setStatus} data={['Todos', 'Activo', 'Seguimiento', 'Nuevo']} w={150} />
        </Group>
        <Button leftSection={<IconPlus size={16} />} onClick={onNewPatient}>Nuevo paciente</Button>
      </Group>
      <ScrollArea>
        <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md" miw={830}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Paciente</Table.Th>
              <Table.Th>Contacto</Table.Th>
              <Table.Th>Motivo principal</Table.Th>
              <Table.Th>Última visita</Table.Th>
              <Table.Th>Próxima cita</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((patient) => (
              <Table.Tr key={patient.id} onClick={onOpenPatient} className="clickable-row">
                <Table.Td><Group gap="sm" wrap="nowrap"><Avatar color={patient.color} radius="sm" size={34}>{patient.initials}</Avatar><Box><Text size="sm" fw={600}>{patient.name}</Text><Text size="xs" c="dimmed">{patient.id} | {patient.age} años</Text></Box></Group></Table.Td>
                <Table.Td><Text size="sm">{patient.phone}</Text><Text size="xs" c="dimmed">{patient.gender}</Text></Table.Td>
                <Table.Td><Text size="sm">{patient.condition}</Text></Table.Td>
                <Table.Td><Text size="sm">{patient.lastVisit}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={500}>{patient.nextVisit}</Text></Table.Td>
                <Table.Td><Badge color={statusColor(patient.status)} variant="light" radius="sm">{patient.status}</Badge></Table.Td>
                <Table.Td><ActionIcon variant="subtle" aria-label={`Abrir expediente de ${patient.name}`}><IconChevronRight size={17} /></ActionIcon></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {filtered.length === 0 && <Stack align="center" py={48}><ThemeIcon size={42} variant="light"><IconSearch size={20} /></ThemeIcon><Text fw={600}>No encontramos pacientes</Text><Text size="sm" c="dimmed">Prueba otro nombre o cambia el filtro de estado.</Text></Stack>}
      <Group justify="space-between" mt="md"><Text size="xs" c="dimmed">Mostrando {filtered.length} de 286 pacientes</Text><Group gap={4}><ActionIcon variant="default" disabled><IconChevronLeft size={15} /></ActionIcon><Button variant="light" size="compact-sm">1</Button><Button variant="subtle" color="gray" size="compact-sm">2</Button><Button variant="subtle" color="gray" size="compact-sm">3</Button><ActionIcon variant="default"><IconChevronRight size={15} /></ActionIcon></Group></Group>
    </Paper>
  );
}

function EncounterScreen({ onFinish }: { onFinish: () => void }) {
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('Motivo');
  const sections = ['Motivo', 'Signos vitales', 'Exploración', 'Evaluación', 'Plan'];
  return (
    <div className="encounter-layout">
      <Paper withBorder shadow="sm" className="encounter-nav">
        <Group wrap="nowrap" mb="lg"><Avatar color="grape" radius="sm" size={38}>AM</Avatar><Box><Text size="sm" fw={600}>Ana María López</Text><Text size="xs" c="dimmed">42 años | PA-1048</Text></Box></Group>
        <Stack gap={4}>{sections.map((section, index) => <UnstyledButton key={section} className={`encounter-step ${activeSection === section ? 'active' : ''}`} onClick={() => setActiveSection(section)}><span>{index + 1}</span><Text size="sm" fw={500}>{section}</Text>{index < 2 && <IconClipboardCheck size={16} />}</UnstyledButton>)}</Stack>
        <Divider my="lg" />
        <Text size="xs" c="dimmed">Borrador guardado automáticamente</Text>
        <Text size="xs" c="dimmed">Hace unos segundos</Text>
      </Paper>
      <Paper withBorder shadow="sm" className="content-panel encounter-form">
        <Group justify="space-between" mb="xl"><Box><Title order={2}>Consulta de seguimiento</Title><Text size="sm" c="dimmed">Domingo, 28 de septiembre de 2026 | 10:30</Text></Box>{saved && <Badge color="green" variant="light" radius="sm">Borrador guardado</Badge>}</Group>
        <Stack gap="lg">
          <Box><Text size="sm" fw={600} mb={6}>Motivo de consulta</Text><Textarea minRows={2} defaultValue="Control de presión arterial y seguimiento de tratamiento antihipertensivo." /></Box>
          <Box>
            <Text size="sm" fw={600} mb="sm">Signos vitales</Text>
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="sm"><TextInput label="PA sistólica" rightSection={<Text size="xs" c="dimmed">mmHg</Text>} defaultValue="132" /><TextInput label="PA diastólica" rightSection={<Text size="xs" c="dimmed">mmHg</Text>} defaultValue="84" /><TextInput label="Frecuencia" rightSection={<Text size="xs" c="dimmed">lpm</Text>} defaultValue="74" /><TextInput label="Temperatura" rightSection={<Text size="xs" c="dimmed">°C</Text>} defaultValue="36.7" /></SimpleGrid>
          </Box>
          <Box><Text size="sm" fw={600} mb={6}>Subjetivo</Text><Textarea minRows={3} defaultValue="Paciente refiere buena adherencia al tratamiento. Niega cefalea, mareos, dolor torácico o disnea. Ha reducido el consumo de sal." /></Box>
          <Box><Text size="sm" fw={600} mb={6}>Objetivo y exploración</Text><Textarea minRows={3} defaultValue="Alerta, orientada, hidratada. Ruidos cardiacos rítmicos, sin soplos. Campos pulmonares ventilados. Sin edema periférico." /></Box>
          <Box><Text size="sm" fw={600} mb={6}>Evaluación</Text><TextInput defaultValue="Hipertensión esencial controlada" rightSection={<Badge color="grape" variant="light" radius="sm">I10</Badge>} /></Box>
          <Box><Text size="sm" fw={600} mb={6}>Plan</Text><Textarea minRows={4} defaultValue={'Continuar losartán 50 mg cada mañana.\nMantener registro domiciliario de presión arterial.\nControl en 4 semanas con creatinina y electrolitos.'} /></Box>
        </Stack>
        <Group justify="flex-end" mt="xl"><Button variant="default" onClick={() => setSaved(true)}>Guardar borrador</Button><Button leftSection={<IconClipboardCheck size={17} />} onClick={onFinish}>Firmar y finalizar</Button></Group>
      </Paper>
    </div>
  );
}

function OrdersScreen() {
  const [tab, setTab] = useState<string | null>('results');
  return (
    <Paper withBorder shadow="sm" className="content-panel">
      <Tabs value={tab} onChange={setTab} variant="pills" radius="sm">
        <Group justify="space-between" mb="lg"><Tabs.List><Tabs.Tab value="results">Resultados</Tabs.Tab><Tabs.Tab value="orders">Órdenes activas</Tabs.Tab><Tabs.Tab value="documents">Documentos</Tabs.Tab></Tabs.List><Button leftSection={<IconPlus size={16} />}>Nueva orden</Button></Group>
        <Tabs.Panel value="results">
          <Group justify="space-between" mb="md"><TextInput leftSection={<IconSearch size={16} />} placeholder="Buscar paciente o estudio" w={{ base: '100%', sm: 340 }} /><Select data={['Todos', 'Requiere revisión', 'Revisado']} defaultValue="Todos" w={180} /></Group>
          <ScrollArea><Table highlightOnHover verticalSpacing="sm" miw={760}><Table.Thead><Table.Tr><Table.Th>Paciente</Table.Th><Table.Th>Estudio</Table.Th><Table.Th>Recibido</Table.Th><Table.Th>Resultado</Table.Th><Table.Th>Estado</Table.Th><Table.Th /></Table.Tr></Table.Thead><Table.Tbody>
            {[
              ['Mariela Brenes', 'Hemograma completo', 'Hace 18 min', 'Dentro de rango', 'Revisar'],
              ['José Ramón Pérez', 'HbA1c', 'Hoy, 08:42', '7.4%', 'Revisar'],
              ['Ana María López', 'Creatinina y electrolitos', '27 sep, 16:20', 'Sin alteraciones', 'Revisado'],
              ['Lucía Rivas', 'Proteína C reactiva', '26 sep, 11:05', '12.8 mg/L', 'Revisado'],
              ['Carlos Mejía', 'Perfil lipídico', '25 sep, 09:32', 'LDL 146 mg/dL', 'Revisado'],
            ].map(([patient, study, received, result, status]) => <Table.Tr key={`${patient}-${study}`}><Table.Td><Text size="sm" fw={600}>{patient}</Text></Table.Td><Table.Td><Text size="sm">{study}</Text></Table.Td><Table.Td><Text size="sm" c="dimmed">{received}</Text></Table.Td><Table.Td><Text size="sm" fw={500}>{result}</Text></Table.Td><Table.Td><Badge color={statusColor(status)} variant="light" radius="sm">{status}</Badge></Table.Td><Table.Td><ActionIcon variant="subtle"><IconChevronRight size={17} /></ActionIcon></Table.Td></Table.Tr>)}
          </Table.Tbody></Table></ScrollArea>
        </Tabs.Panel>
        <Tabs.Panel value="orders"><Stack align="center" py={48}><ThemeIcon size={44} variant="light"><IconFileDescription size={21} /></ThemeIcon><Text fw={600}>3 órdenes activas</Text><Text size="sm" c="dimmed">Las órdenes pendientes de toma o procesamiento aparecerán aquí.</Text></Stack></Tabs.Panel>
        <Tabs.Panel value="documents"><Stack align="center" py={48}><ThemeIcon size={44} variant="light"><IconNotes size={21} /></ThemeIcon><Text fw={600}>Documentos clínicos</Text><Text size="sm" c="dimmed">Recetas, certificados y consentimientos emitidos.</Text></Stack></Tabs.Panel>
      </Tabs>
    </Paper>
  );
}

function SettingsScreen() {
  const settingsItems = [
    { label: 'Clínica', icon: IconHeartbeat },
    { label: 'Equipo y permisos', icon: IconUsers },
    { label: 'Agenda', icon: IconCalendarEvent },
    { label: 'Notificaciones', icon: IconBell },
    { label: 'Integraciones', icon: IconAdjustments },
  ];

  return (
    <div className="settings-layout">
      <Paper withBorder shadow="sm" className="settings-nav"><Text size="xs" c="dimmed" fw={600} mb="xs">CONFIGURACIÓN</Text>{settingsItems.map((item, index) => { const Icon = item.icon; return <NavLink key={item.label} label={item.label} active={index === 0} leftSection={<Icon size={17} />} />; })}</Paper>
      <Paper withBorder shadow="sm" className="content-panel settings-content">
        <SectionHeader title="Información de la clínica" description="Datos visibles en documentos y comunicaciones." />
        <SimpleGrid cols={{ base: 1, md: 2 }} mt="lg"><TextInput label="Nombre de la clínica" defaultValue="Clínica Aurora" /><TextInput label="Teléfono" defaultValue="+505 2255 0184" /><TextInput label="Correo de atención" defaultValue="contacto@clinicaaurora.com" /><TextInput label="Zona horaria" defaultValue="America/Managua" /></SimpleGrid>
        <TextInput label="Dirección" defaultValue="Reparto San Juan, Managua, Nicaragua" mt="md" />
        <Divider my="xl" />
        <Title order={3}>Preferencias operativas</Title>
        <Text size="xs" c="dimmed" mb="md">Comportamiento predeterminado para el equipo.</Text>
        <Stack gap={0}>
          <Group justify="space-between" className="setting-row"><Box><Text size="sm" fw={600}>Recordatorios automáticos</Text><Text size="xs" c="dimmed">Enviar recordatorio 24 horas antes de cada cita.</Text></Box><Switch defaultChecked /></Group>
          <Group justify="space-between" className="setting-row"><Box><Text size="sm" fw={600}>Confirmación requerida</Text><Text size="xs" c="dimmed">Marcar las citas nuevas como pendientes de confirmación.</Text></Box><Switch defaultChecked /></Group>
          <Group justify="space-between" className="setting-row"><Box><Text size="sm" fw={600}>Notas clínicas privadas</Text><Text size="xs" c="dimmed">Ocultar notas internas en documentos para pacientes.</Text></Box><Switch defaultChecked /></Group>
        </Stack>
        <Divider my="xl" />
        <Group justify="space-between" align="flex-end"><Box><Title order={3}>Google Calendar</Title><Text size="xs" c="dimmed">Sincroniza la agenda de cada profesional.</Text></Box><Button variant="default" leftSection={<IconBrandGoogleFilled size={17} />}>Conectar</Button></Group>
        <Group justify="flex-end" mt="xl"><Button>Guardar cambios</Button></Group>
      </Paper>
    </div>
  );
}

function App() {
  const initial = (window.location.hash.replace('#/', '') || 'dashboard') as Screen;
  const [screen, setScreen] = useState<Screen>(screenTitles[initial] ? initial : 'dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);
  const [appointmentOpen, { open: openAppointment, close: closeAppointment }] = useDisclosure(false);
  const [patientOpen, { open: openPatient, close: closePatient }] = useDisclosure(false);
  const [notificationsOpen, { open: openNotifications, close: closeNotifications }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [patientTab, setPatientTab] = useState<PatientTab>('Tareas');

  useEffect(() => {
    const handleHash = () => {
      const next = window.location.hash.replace('#/', '') as Screen;
      if (screenTitles[next]) setScreen(next);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (next: Screen) => {
    window.location.hash = `/${next}`;
    setScreen(next);
    closeMobile();
  };

  const openPatientWorkspace = (tab: PatientTab = 'Tareas') => {
    setPatientTab(tab);
    navigate('patient-detail');
  };

  const current = screenTitles[screen];
  const matchingPatients = useMemo(() => search.length > 1 ? patients.filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3) : [], [search]);

  const submitAppointment = (event: FormEvent) => {
    event.preventDefault();
    closeAppointment();
    setToast('La cita de prueba se agregó a la agenda.');
    window.setTimeout(() => setToast(''), 3400);
  };

  return (
    <AppShell navbar={{ width: collapsed ? 64 : 'clamp(218px, 17.3vw, 340px)', breakpoint: 'sm', collapsed: { mobile: !mobileOpen } }} padding={0} className={`clinical-shell ${screen === 'patient-detail' ? 'patient-mode' : ''}`}>
      <AppShell.Navbar className="app-navbar">
        <Group className="brand-row" justify={collapsed ? 'center' : 'space-between'} wrap="nowrap">
          <ThemeIcon size={34} radius="xl" color="grape" variant="filled" aria-label="Clínica Aurora"><IconMedicalCross size={22} /></ThemeIcon>
          {!collapsed && <Text size="sm" fw={700} className="brand-name">Clínica Aurora</Text>}
          <ActionIcon className="sidebar-mobile-close" variant="subtle" color="gray" aria-label="Cerrar navegación" onClick={closeMobile}><IconX size={19} /></ActionIcon>
        </Group>
        <ScrollArea className="nav-scroll">
          <Stack gap={3} p="xs" className="main-nav-list">
            {!collapsed && <div className="sidebar-search"><TextInput value={search} onChange={(event) => setSearch(event.currentTarget.value)} leftSection={<IconSearch size={18} />} placeholder="Buscar" aria-label="Buscar pacientes en la navegación" />{matchingPatients.length > 0 && <Paper className="sidebar-search-results" withBorder>{matchingPatients.map((patient) => <UnstyledButton key={patient.id} onClick={() => { openPatientWorkspace(); setSearch(''); }}><Text size="sm" fw={500}>{patient.name}</Text></UnstyledButton>)}</Paper>}</div>}
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = screen === item.screen || (screen === 'patient-detail' && item.screen === 'patients');
              return collapsed ? <Tooltip label={item.label} position="right" key={item.screen}><ActionIcon className={`collapsed-nav ${active ? 'active' : ''}`} variant="subtle" color={active ? 'grape' : 'gray'} size={40} onClick={() => navigate(item.screen)} aria-label={item.label}><Icon size={19} stroke={1.8} /></ActionIcon></Tooltip> : <NavLink key={item.screen} label={item.label} active={active} leftSection={<Icon size={18} stroke={1.8} />} onClick={() => navigate(item.screen)} />;
            })}
            {collapsed ? <><Tooltip label="Mensajes" position="right"><ActionIcon className="collapsed-nav" variant="subtle" color="gray" size={40} onClick={() => openPatientWorkspace('Mensajes')} aria-label="Mensajes"><IconMessageCircle size={19} stroke={1.8} /></ActionIcon></Tooltip><Tooltip label="Tareas" position="right"><ActionIcon className="collapsed-nav" variant="subtle" color="gray" size={40} onClick={() => openPatientWorkspace('Tareas')} aria-label="Tareas"><IconClipboardCheck size={19} stroke={1.8} /></ActionIcon></Tooltip></> : <><NavLink label="Mensajes" leftSection={<IconMessageCircle size={18} stroke={1.8} />} onClick={() => openPatientWorkspace('Mensajes')} /><NavLink label="Tareas" leftSection={<IconClipboardCheck size={18} stroke={1.8} />} onClick={() => openPatientWorkspace('Tareas')} /><Text className="sidebar-group-label">Accesos rápidos</Text><NavLink label="Nuevo paciente" leftSection={<IconPlus size={18} stroke={1.8} />} onClick={openPatient} /><NavLink label="Integraciones" leftSection={<IconAdjustments size={18} stroke={1.8} />} onClick={() => navigate('settings')} /><NavLink label="Configuración" active={screen === 'settings'} leftSection={<IconSettings size={18} stroke={1.8} />} onClick={() => navigate('settings')} /></>}
          </Stack>
        </ScrollArea>
        <div className="navbar-footer">
          <ActionIcon variant="subtle" color="gray" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expandir navegación' : 'Contraer navegación'} className="sidebar-collapse">{collapsed ? <IconLayoutSidebarLeftExpand size={19} /> : <IconLayoutSidebarLeftCollapse size={19} />}</ActionIcon>
          {collapsed ? <Avatar radius="xl" size={34} color="gray">LO</Avatar> : <UnstyledButton className="profile-button"><Avatar radius="xl" size={30} color="gray">LO</Avatar><Box className="profile-copy"><Text size="sm" fw={500}>Dra. Laura Ortega</Text></Box></UnstyledButton>}
        </div>
      </AppShell.Navbar>
      <AppShell.Main>
        {screen === 'patient-detail' && <header className="workspace-mobile-header"><Burger opened={mobileOpen} onClick={toggleMobile} size="sm" aria-label="Abrir navegación" /><div><Text size="xs" c="dimmed">Pacientes / Expediente</Text><Text size="sm" fw={700}>Ana María López</Text></div></header>}
        {screen !== 'patient-detail' && <header className="topbar">
          <Group gap="sm" wrap="nowrap" className="topbar-left"><Burger opened={mobileOpen} onClick={toggleMobile} hiddenFrom="sm" size="sm" /><Box><Title order={1}>{current.title}</Title><Text size="xs" c="dimmed">{current.description}</Text></Box></Group>
          <Group gap="sm" wrap="nowrap">
            <div className="global-search"><TextInput value={search} onChange={(event) => setSearch(event.currentTarget.value)} leftSection={<IconSearch size={16} />} rightSection={search ? <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => setSearch('')}><IconX size={14} /></ActionIcon> : undefined} placeholder="Buscar pacientes" aria-label="Buscar pacientes" />{matchingPatients.length > 0 && <Paper className="search-results" shadow="md" withBorder>{matchingPatients.map((patient) => <UnstyledButton key={patient.id} onClick={() => { openPatientWorkspace(); setSearch(''); }}><Avatar color={patient.color} radius="sm" size={30}>{patient.initials}</Avatar><Box><Text size="xs" fw={600}>{patient.name}</Text><Text size="xs" c="dimmed">{patient.id}</Text></Box></UnstyledButton>)}</Paper>}</div>
            <Indicator color="red" size={8} offset={4}><ActionIcon variant="default" size={36} onClick={openNotifications} aria-label="Notificaciones"><IconBell size={18} /></ActionIcon></Indicator>
            <Menu position="bottom-end" shadow="md"><Menu.Target><ActionIcon variant="default" size={36} aria-label="Acciones rápidas"><IconPlus size={18} /></ActionIcon></Menu.Target><Menu.Dropdown><Menu.Label>Crear</Menu.Label><Menu.Item leftSection={<IconCalendarEvent size={16} />} onClick={openAppointment}>Nueva cita</Menu.Item><Menu.Item leftSection={<IconUser size={16} />} onClick={openPatient}>Nuevo paciente</Menu.Item><Menu.Item leftSection={<IconFileDescription size={16} />} onClick={() => navigate('encounter')}>Nueva consulta</Menu.Item></Menu.Dropdown></Menu>
          </Group>
        </header>}
        <main className={`page-content ${screen === 'patient-detail' ? 'workspace-page' : ''}`}>
          {screen === 'dashboard' && <DashboardScreen onOpenPatient={() => openPatientWorkspace()} onNavigate={navigate} />}
          {screen === 'agenda' && <AgendaScreen onNewAppointment={openAppointment} onOpenPatient={() => openPatientWorkspace()} />}
          {screen === 'patients' && <PatientsScreen onOpenPatient={() => openPatientWorkspace()} onNewPatient={openPatient} />}
          {screen === 'patient-detail' && <PatientWorkspace activeTab={patientTab} onTabChange={setPatientTab} onBack={() => navigate('patients')} onStartEncounter={() => navigate('encounter')} />}
          {screen === 'encounter' && <EncounterScreen onFinish={() => { setToast('La consulta se firmó y quedó en la historia clínica.'); navigate('patient-detail'); window.setTimeout(() => setToast(''), 3400); }} />}
          {screen === 'orders' && <OrdersScreen />}
          {screen === 'settings' && <SettingsScreen />}
        </main>
      </AppShell.Main>

      <Modal opened={appointmentOpen} onClose={closeAppointment} title="Nueva cita" centered>
        <form onSubmit={submitAppointment}><Stack><Select required searchable label="Paciente" placeholder="Selecciona un paciente" data={patients.map((patient) => patient.name)} /><TextInput required label="Motivo" defaultValue="Consulta de seguimiento" /><SimpleGrid cols={2}><TextInput required type="date" label="Fecha" defaultValue="2026-09-29" /><TextInput required type="time" label="Hora" defaultValue="09:30" /></SimpleGrid><Select label="Modalidad" defaultValue="Presencial" data={['Presencial', 'Videollamada']} /><Select label="Profesional" defaultValue="Dra. Laura Ortega" data={['Dra. Laura Ortega', 'Dr. Mateo Suárez']} /><Group justify="flex-end" mt="sm"><Button variant="default" onClick={closeAppointment}>Cancelar</Button><Button type="submit">Guardar cita</Button></Group></Stack></form>
      </Modal>

      <Modal opened={patientOpen} onClose={closePatient} title="Nuevo paciente" centered>
        <form onSubmit={(event) => { event.preventDefault(); closePatient(); setToast('El paciente de prueba se agregó al directorio.'); window.setTimeout(() => setToast(''), 3400); }}><Stack><SimpleGrid cols={2}><TextInput required label="Nombres" /><TextInput required label="Apellidos" /></SimpleGrid><SimpleGrid cols={2}><TextInput required type="date" label="Fecha de nacimiento" /><Select required label="Sexo" data={['Femenino', 'Masculino', 'Otro']} /></SimpleGrid><TextInput required label="Teléfono" /><TextInput type="email" label="Correo" /><Textarea label="Notas iniciales" minRows={2} /><Group justify="flex-end" mt="sm"><Button variant="default" onClick={closePatient}>Cancelar</Button><Button type="submit">Crear expediente</Button></Group></Stack></form>
      </Modal>

      <Drawer opened={notificationsOpen} onClose={closeNotifications} position="right" title="Notificaciones" size="sm">
        <Stack gap={0}>{[
          ['Resultado listo para revisión', 'Hemograma de Mariela Brenes', 'Hace 18 min', IconFlask],
          ['Paciente confirmado', 'Ana María López confirmó su cita', 'Hace 42 min', IconCalendarEvent],
          ['Nota pendiente de firma', 'Consulta de Ricardo Gutiérrez', 'Hace 1 h', IconNotes],
        ].map(([title, body, time, Icon]) => <UnstyledButton className="notification-row" key={String(title)}><ThemeIcon variant="light" radius="sm"><Icon size={17} /></ThemeIcon><Box><Text size="sm" fw={600}>{String(title)}</Text><Text size="xs" c="dimmed">{String(body)}</Text><Text size="xs" c="dimmed" mt={3}>{String(time)}</Text></Box></UnstyledButton>)}</Stack>
      </Drawer>

      {toast && <Paper className="toast" shadow="md" withBorder><IconClipboardCheck size={18} /><Text size="sm" fw={600}>{toast}</Text></Paper>}
    </AppShell>
  );
}

export default App;
