import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Modal,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconClipboardCheck,
  IconFilterPlus,
  IconFlask,
  IconGenderFemale,
  IconLanguage,
  IconMapPin,
  IconMedicalCross,
  IconPencilPlus,
  IconPlus,
  IconStethoscope,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import { FormEvent, useState } from 'react';
import './PatientWorkspace.css';

export type PatientTab = 'Cronología' | 'Visitas' | 'Tareas' | 'Medicamentos' | 'DoseSpot' | 'Laboratorios' | 'Dispositivos' | 'Documentos' | 'Planes de cuidado' | 'Mensajes';
type TaskStatus = 'En progreso' | 'Lista' | 'Solicitada' | 'Completada';
type PatientTask = {
  id: number;
  title: string;
  due: string;
  assignee: string;
  status: TaskStatus;
  description: string;
};
type TaskNote = { author: string; date: string; text: string };

const tabs: PatientTab[] = ['Cronología', 'Visitas', 'Tareas', 'Medicamentos', 'DoseSpot', 'Laboratorios', 'Dispositivos', 'Documentos', 'Planes de cuidado', 'Mensajes'];

const initialTasks: PatientTask[] = [
  { id: 1, title: 'Revisar y validar resultados de laboratorio', due: '29/09/2026', assignee: 'Dra. Laura Ortega', status: 'En progreso', description: 'Revisar el perfil lipídico recibido el 27/09/2026 y confirmar el plan de seguimiento con Ana María.' },
  { id: 2, title: 'Conciliar lista de medicamentos', due: '30/09/2026', assignee: 'Dra. Laura Ortega', status: 'Lista', description: 'Confirmar dosis y frecuencia de losartán con la paciente durante la próxima visita.' },
  { id: 3, title: 'Completar autorización previa', due: '01/10/2026', assignee: 'Dra. Laura Ortega', status: 'En progreso', description: 'Preparar la documentación para la autorización del estudio complementario.' },
  { id: 4, title: 'Seguimiento de interconsulta', due: '03/10/2026', assignee: 'Equipo de enfermería', status: 'Lista', description: 'Coordinar la cita de seguimiento y registrar la respuesta del especialista.' },
  { id: 5, title: 'Responder mensaje de la paciente', due: '05/10/2026', assignee: 'Dra. Laura Ortega', status: 'Solicitada', description: 'Responder la consulta de Ana María sobre sus registros de presión arterial.' },
];

const clinicalLists: Record<Exclude<PatientTab, 'Tareas'>, { heading: string; items: Array<{ title: string; detail: string; meta?: string }> }> = {
  'Cronología': { heading: 'Cronología clínica', items: [
    { title: 'Control de hipertensión', detail: 'Presión arterial estable. Continúa tratamiento actual.', meta: '24 sep 2026' },
    { title: 'Resultado de perfil lipídico', detail: 'Resultado recibido para revisión clínica.', meta: '27 sep 2026' },
    { title: 'Seguimiento clínico', detail: 'Mejoría de cefalea. Sin eventos adversos.', meta: '26 ago 2026' },
  ] },
  'Visitas': { heading: 'Visitas', items: [
    { title: 'Control de presión arterial', detail: 'Consulta programada · Dra. Laura Ortega', meta: 'Hoy, 10:30' },
    { title: 'Control de hipertensión', detail: 'Consulta finalizada · Dra. Laura Ortega', meta: '24 sep 2026' },
    { title: 'Seguimiento clínico', detail: 'Consulta finalizada · Dra. Laura Ortega', meta: '26 ago 2026' },
  ] },
  'Medicamentos': { heading: 'Medicamentos', items: [
    { title: 'Losartán 50 mg', detail: '1 tableta por vía oral cada mañana · Activo', meta: 'Desde jul 2026' },
    { title: 'Paracetamol 500 mg', detail: 'Según necesidad · Suspendido', meta: 'Ago 2026' },
  ] },
  'DoseSpot': { heading: 'Recetas electrónicas', items: [
    { title: 'Losartán 50 mg', detail: 'Receta de demostración · pendiente de integración con DoseSpot', meta: '24 sep 2026' },
  ] },
  'Laboratorios': { heading: 'Laboratorios', items: [
    { title: 'Perfil lipídico', detail: 'Resultado pendiente de firma', meta: '27 sep 2026' },
    { title: 'Hemograma completo', detail: 'Resultado revisado', meta: '18 jul 2026' },
  ] },
  'Dispositivos': { heading: 'Dispositivos', items: [
    { title: 'Tensiómetro domiciliario', detail: 'Registros aportados por la paciente', meta: 'Activo' },
  ] },
  'Documentos': { heading: 'Documentos', items: [
    { title: 'Plan de control de presión arterial', detail: 'Documento clínico', meta: '24 sep 2026' },
    { title: 'Consentimiento informado', detail: 'Documento firmado', meta: '18 jul 2026' },
  ] },
  'Planes de cuidado': { heading: 'Planes de cuidado', items: [
    { title: 'Seguimiento de hipertensión', detail: 'Control mensual, registro domiciliario de presión y revisión de tratamiento.', meta: 'Activo' },
  ] },
  'Mensajes': { heading: 'Mensajes', items: [
    { title: 'Consulta sobre presión arterial', detail: 'Mensaje de Ana María · pendiente de respuesta', meta: '27 sep 2026' },
    { title: 'Indicaciones posteriores a consulta', detail: 'Mensaje enviado por el equipo clínico', meta: '24 sep 2026' },
  ] },
};

function StatusPill({ status }: { status: TaskStatus }) {
  return <span className={`workspace-status status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>;
}

function InfoSection({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="workspace-info-section">
      <div className="workspace-section-heading">
        <button type="button" className="workspace-section-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
          <IconChevronDown size={18} className={open ? '' : 'rotated'} />
          <span>{title}</span>
        </button>
        {action}
      </div>
      {open && <div className="workspace-section-content">{children}</div>}
    </section>
  );
}

export default function PatientWorkspace({ onBack, onStartEncounter, activeTab, onTabChange }: { onBack: () => void; onStartEncounter: () => void; activeTab: PatientTab; onTabChange: (tab: PatientTab) => void }) {
  const [taskScope, setTaskScope] = useState('Mis tareas');
  const [openOnly, setOpenOnly] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState(1);
  const [notes, setNotes] = useState<Record<number, TaskNote[]>>({
    1: [
      { author: 'Mariela Brenes', date: '27/09/26 a las 10:48', text: 'Los resultados del perfil lipídico ya están disponibles para revisión.' },
      { author: 'Dra. Laura Ortega', date: '27/09/26 a las 12:23', text: 'Gracias, revisaré los valores y daré seguimiento a la paciente.' },
    ],
  });
  const [noteDraft, setNoteDraft] = useState('');
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('2026-09-30');
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const visibleTasks = tasks.filter((task) => (taskScope === 'Todas' || task.assignee === 'Dra. Laura Ortega') && (!openOnly || task.status !== 'Completada'));

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    const id = Math.max(...tasks.map((task) => task.id), 0) + 1;
    const due = newTaskDue.split('-').reverse().join('/');
    setTasks((current) => [...current, { id, title, due, assignee: 'Dra. Laura Ortega', status: 'Lista', description: 'Tarea creada en este prototipo para el seguimiento de Ana María López.' }]);
    setTaskScope('Mis tareas');
    setSelectedTaskId(id);
    setNewTaskTitle('');
    setNewTaskOpen(false);
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = noteDraft.trim();
    if (!selectedTask || !text) return;
    const date = new Intl.DateTimeFormat('es', { dateStyle: 'short', timeStyle: 'short' }).format(new Date());
    setNotes((current) => ({ ...current, [selectedTask.id]: [...(current[selectedTask.id] ?? []), { author: 'Dra. Laura Ortega', date, text }] }));
    setNoteDraft('');
  }

  return (
    <div className="patient-workspace">
      <aside className="workspace-profile" aria-label="Resumen del paciente">
        <div className="workspace-patient-heading">
          <Avatar size={62} radius="xl" color="grape" className="workspace-avatar">AM</Avatar>
          <div><h1>Ana María López</h1><span>12/05/1984</span></div>
        </div>
        <div className="workspace-demographics">
          <div><IconCalendarEvent size={19} /><span>12/05/1984 (42 años)</span></div>
          <div><IconGenderFemale size={19} /><span>Femenino</span></div>
          <div><IconUsers size={19} /><span>Hispana</span></div>
          <div><IconMapPin size={19} /><span>Managua, Nicaragua</span></div>
          <div><IconLanguage size={19} /><span>Español</span></div>
          <div><IconStethoscope size={19} /><span>Dra. Laura Ortega</span></div>
        </div>
        <InfoSection title="Seguro">
          <p className="workspace-primary-value">Seguro Médico Nacional</p>
          <p>Plan individual · ID: SMN-1048</p>
          <div className="workspace-inline-status"><span className="workspace-chip active">ACTIVO</span><span>Vigente hasta 31/12/2026</span></div>
        </InfoSection>
        <InfoSection title="Alergias" action={<Tooltip label="Añadir alergia"><ActionIcon variant="subtle" color="blue" size="sm" aria-label="Añadir alergia" onClick={onStartEncounter}><IconPlus size={18} /></ActionIcon></Tooltip>}>
          <p className="workspace-primary-value">Penicilina</p><span className="workspace-chip active-danger">ACTIVA</span>
        </InfoSection>
        <InfoSection title="Problemas" action={<Tooltip label="Añadir problema"><ActionIcon variant="subtle" color="blue" size="sm" aria-label="Añadir problema" onClick={onStartEncounter}><IconPlus size={18} /></ActionIcon></Tooltip>}>
          <div className="workspace-condition"><p className="workspace-primary-value">Hipertensión esencial</p><span className="workspace-chip active">ACTIVA</span></div>
          <div className="workspace-condition"><p className="workspace-primary-value">Cefalea episódica</p><span className="workspace-chip inactive">INACTIVA</span><span className="workspace-condition-date">26/08/2026</span></div>
          <div className="workspace-condition"><p className="workspace-primary-value">Dislipidemia</p><span className="workspace-chip active">ACTIVA</span></div>
        </InfoSection>
        <div className="workspace-profile-actions"><Button variant="subtle" color="gray" leftSection={<IconChevronLeft size={16} />} onClick={onBack}>Volver a pacientes</Button></div>
      </aside>

      <div className="workspace-main">
        <nav className="workspace-tabs" aria-label="Secciones del expediente">
          {tabs.map((tab) => <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} aria-current={activeTab === tab ? 'page' : undefined} onClick={() => onTabChange(tab)}>{tab}</button>)}
        </nav>
        {activeTab === 'Tareas' ? (
          <div className="workspace-task-layout">
            <section className="workspace-task-list" aria-label="Tareas del paciente">
              <div className="workspace-task-toolbar">
                <SegmentedControl value={taskScope} onChange={setTaskScope} data={['Mis tareas', 'Todas']} size="sm" />
                <div className="workspace-toolbar-actions">
                  <Tooltip label={openOnly ? 'Mostrar todas las tareas' : 'Mostrar sólo tareas abiertas'}><ActionIcon variant="default" radius="xl" size={38} aria-label={openOnly ? 'Mostrar todas las tareas' : 'Mostrar sólo tareas abiertas'} onClick={() => setOpenOnly(!openOnly)} className={openOnly ? 'filter-active' : ''}><IconFilterPlus size={19} /></ActionIcon></Tooltip>
                  <Tooltip label="Nueva tarea"><ActionIcon color="blue" radius="xl" size={40} aria-label="Nueva tarea" onClick={() => setNewTaskOpen(true)}><IconPlus size={20} /></ActionIcon></Tooltip>
                </div>
              </div>
              <ScrollArea className="workspace-task-scroll">
                {visibleTasks.map((task) => <button type="button" key={task.id} className={`workspace-task-item ${selectedTaskId === task.id ? 'selected' : ''}`} onClick={() => setSelectedTaskId(task.id)}>
                  <div className="workspace-task-line"><strong>{task.title}</strong><StatusPill status={task.status} /></div>
                  <span>Vence {task.due}</span>
                  <small>Asignada a {task.assignee}</small>
                </button>)}
                {visibleTasks.length === 0 && <p className="workspace-empty">No hay tareas con este filtro.</p>}
              </ScrollArea>
            </section>
            <section className="workspace-task-detail" aria-label="Detalle de la tarea">
              {selectedTask ? <>
                <div className="workspace-detail-heading">
                  <h2>{selectedTask.title}</h2>
                  <div className="workspace-detail-actions">
                    <Tooltip label="Eliminar tarea de demostración"><ActionIcon variant="default" radius="xl" size={38} aria-label="Eliminar tarea de demostración" onClick={() => { setTasks((current) => current.filter((task) => task.id !== selectedTask.id)); setSelectedTaskId(tasks.find((task) => task.id !== selectedTask.id)?.id ?? 0); }}><IconTrash size={19} /></ActionIcon></Tooltip>
                    <Tooltip label="Marcar como completada"><ActionIcon color="blue" radius="xl" size={40} aria-label="Marcar como completada" disabled={selectedTask.status === 'Completada'} onClick={() => setTasks((current) => current.map((task) => task.id === selectedTask.id ? { ...task, status: 'Completada' } : task))}><IconCheck size={21} /></ActionIcon></Tooltip>
                  </div>
                </div>
                <p className="workspace-task-description">{selectedTask.description}</p>
                <div className="workspace-notes">
                  <h3>Notas</h3>
                  {(notes[selectedTask.id] ?? []).length === 0 && <p className="workspace-no-notes">Aún no hay notas en esta tarea.</p>}
                  {(notes[selectedTask.id] ?? []).map((note, index) => <article className="workspace-note" key={`${note.date}-${index}`}>
                    <div className="workspace-note-meta"><Avatar size={31} radius="xl" color="gray">{note.author.split(' ').map((part) => part[0]).slice(0, 2).join('')}</Avatar><strong>{note.author}</strong><span>{note.date}</span></div>
                    <p>{note.text}</p>
                  </article>)}
                  <form className="workspace-note-form" onSubmit={addNote}>
                    <Textarea value={noteDraft} onChange={(event) => setNoteDraft(event.currentTarget.value)} placeholder="Añadir una nota sobre esta tarea..." aria-label="Añadir una nota sobre esta tarea" minRows={4} autosize maxRows={6} variant="unstyled" />
                    <Tooltip label="Guardar nota"><ActionIcon color="blue" type="submit" radius="xl" size={38} aria-label="Guardar nota" disabled={!noteDraft.trim()}><IconPencilPlus size={21} /></ActionIcon></Tooltip>
                  </form>
                </div>
              </> : <p className="workspace-empty">Selecciona una tarea para ver sus detalles.</p>}
            </section>
          </div>
        ) : (
          <div className="workspace-other-tab">
            <div className="workspace-module-heading"><div><p>EXPEDIENTE CLÍNICO</p><h2>{clinicalLists[activeTab].heading}</h2></div><Button variant="default" leftSection={<IconMedicalCross size={17} />} onClick={onStartEncounter}>Nueva consulta</Button></div>
            <div className="workspace-module-list">{clinicalLists[activeTab].items.map((item) => <article key={item.title} className="workspace-module-item"><span className="workspace-module-icon">{activeTab === 'Laboratorios' ? <IconFlask size={18} /> : activeTab === 'Visitas' ? <IconCalendarEvent size={18} /> : <IconClipboardCheck size={18} />}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><span className="workspace-module-meta">{item.meta}</span></article>)}</div>
          </div>
        )}
      </div>

      <Modal opened={newTaskOpen} onClose={() => setNewTaskOpen(false)} title="Nueva tarea" centered>
        <form onSubmit={addTask}><Stack><TextInput required label="Tarea" placeholder="Describe la acción pendiente" value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.currentTarget.value)} /><TextInput required type="date" label="Fecha de vencimiento" value={newTaskDue} onChange={(event) => setNewTaskDue(event.currentTarget.value)} /><Text size="xs" c="dimmed">Se asignará a Dra. Laura Ortega en este prototipo.</Text><Group justify="flex-end"><Button variant="default" onClick={() => setNewTaskOpen(false)}>Cancelar</Button><Button type="submit">Crear tarea</Button></Group></Stack></form>
      </Modal>
    </div>
  );
}
