import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const FormLabel = ({ htmlFor, children, required = false }) => (
  <Label htmlFor={htmlFor} className="text-black font-semibold">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </Label>
);

const rolOptions = [
  { value: 'emprendedor', label: 'Emprendedor(a) / Dueño(a) de negocio' },
  { value: 'empresario', label: 'Empresario(a) con equipo consolidado' },
  { value: 'consultor', label: 'Consultor(a) / Freelance / Profesional independiente' },
  { value: 'lider_equipo', label: 'Líder de equipo en empresa' },
  { value: 'profesional_ti', label: 'Profesional de tecnología o transformación digital' },
  { value: 'docente', label: 'Profesor(a) / Docente' },
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'otro', label: 'Otro' },
];

const fuenteOptions = [
    { value: 'conferencia', label: 'En una conferencia', needsDetail: 'text', detailLabel: '¿Cuál?' },
    { value: 'mentoria_kamdata', label: 'En una mentoría o clase de Kamdata', needsDetail: false },
    { value: 'recomendacion', label: 'Por recomendación de alguien', needsDetail: 'text', detailLabel: '¿Quién o cómo?' },
    { value: 'redes_sociales', label: 'En redes sociales', needsDetail: 'select', detailLabel: '¿Cuál?' },
    { value: 'email_whatsapp', label: 'En un correo o WhatsApp de Kamdata', needsDetail: false },
    { value: 'otro', label: 'Otro', needsDetail: 'text', detailLabel: '¿Cuál?' },
];

const redesSocialesOptions = ['Instagram', 'LinkedIn', 'TikTok', 'Facebook', 'Podcast', 'Otra'];

const IntroStep = ({ formData, setFormData, onSubmit }) => {

  const handleRolChange = (checked, rolValue) => {
    const currentRoles = formData.roles || [];
    if (checked) {
      setFormData({ ...formData, roles: [...currentRoles, rolValue] });
    } else {
      setFormData({ ...formData, roles: currentRoles.filter(r => r !== rolValue) });
    }
  };

  const selectedFuente = fuenteOptions.find(f => f.value === formData.fuente_test);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center mb-12 pt-0 md:pt-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn" style={{ color: '#EA4E51' }}>
          🧠 Test: ¿Tienes activado tu Chip Digital?
        </h1>

        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-lg md:text-xl text-black leading-relaxed">
            Este test interactivo de <strong>KAMDATA</strong> evalúa tu mentalidad digital en tres áreas clave: ágil, de crecimiento y exponencial. En solo 4 minutos, descubre tus fortalezas y áreas de oportunidad.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Card className="gradient-card border-black max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center kamdata-red text-2xl">
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel htmlFor="nombre" required>Nombre Completo</FormLabel>
                  <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="border-black"/>
                </div>
                <div>
                  <FormLabel htmlFor="celular" required>Número de Celular</FormLabel>
                  <Input id="celular" type="tel" value={formData.celular} onChange={(e) => setFormData({...formData, celular: e.target.value})} className="border-black"/>
                </div>
              </div>

              <div>
                <FormLabel htmlFor="email" required>Correo Electrónico</FormLabel>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border-black"/>
              </div>

              <div>
                <FormLabel htmlFor="empresa" required>¿A qué empresa o institución perteneces actualmente?</FormLabel>
                <p className="text-xs text-gray-600 mb-2">Si tienes un negocio propio, escribe el nombre. Si no estás vinculado a una empresa, puedes dejarlo en blanco o poner "N/A"</p>
                <Input id="empresa" value={formData.empresa} onChange={(e) => setFormData({...formData, empresa: e.target.value})} className="border-black"/>
              </div>

              <div>
                <FormLabel required>¿Con qué roles te identificas actualmente?</FormLabel>
                <p className="text-xs text-gray-600 mb-2">(Puedes seleccionar más de uno)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {rolOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox id={`rol-${option.value}`} checked={(formData.roles || []).includes(option.value)} onCheckedChange={(checked) => handleRolChange(checked, option.value)} />
                      <Label htmlFor={`rol-${option.value}`} className="font-normal">{option.label}</Label>
                    </div>
                  ))}
                </div>
                {(formData.roles || []).includes('otro') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mt-2">
                    <Input placeholder="Especifica tu otro rol" value={formData.rol_otro_texto} onChange={e => setFormData({...formData, rol_otro_texto: e.target.value})} className="border-black"/>
                  </motion.div>
                )}
              </div>

              <div>
                <FormLabel htmlFor="ciudad">¿Desde qué ciudad estás respondiendo este test?</FormLabel>
                <Input id="ciudad" placeholder="(Respuesta corta)" value={formData.ciudad} onChange={(e) => setFormData({...formData, ciudad: e.target.value})} className="border-black"/>
              </div>

              <div>
                <FormLabel>¿Dónde conociste este test?</FormLabel>
                <Select onValueChange={(value) => setFormData({...formData, fuente_test: value, fuente_test_detalle_texto: '', fuente_test_detalle_red_social: ''})} value={formData.fuente_test}>
                  <SelectTrigger className="border-black">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuenteOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFuente && selectedFuente.needsDetail === 'text' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mt-2">
                    <Input placeholder={selectedFuente.detailLabel} value={formData.fuente_test_detalle_texto} onChange={e => setFormData({...formData, fuente_test_detalle_texto: e.target.value})} className="border-black"/>
                  </motion.div>
                )}
                {selectedFuente && selectedFuente.needsDetail === 'select' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="mt-2">
                     <Select onValueChange={(value) => setFormData({...formData, fuente_test_detalle_red_social: value})} value={formData.fuente_test_detalle_red_social}>
                        <SelectTrigger className="border-black">
                            <SelectValue placeholder={selectedFuente.detailLabel}/>
                        </SelectTrigger>
                        <SelectContent>
                           {redesSocialesOptions.map(net => <SelectItem key={net} value={net}>{net}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </div>


              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terminos" checked={formData.terminos} onCheckedChange={(checked) => setFormData({...formData, terminos: checked})} className="border-2 mt-1" style={{ borderColor: '#EA4E51' }}/>
                  <Label htmlFor="terminos" className="text-sm">
                    <FormLabel htmlFor="terminos" required>Acepto los términos y condiciones (sujetos a la Ley de Transparencia y Protección de Datos de Guanajuato)</FormLabel>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="info_mentorias" checked={formData.info_mentorias} onCheckedChange={(checked) => setFormData({...formData, info_mentorias: checked})} className="border-2 mt-1" style={{ borderColor: '#0492C2' }}/>
                  <Label htmlFor="info_mentorias" className="text-sm font-semibold" style={{ color: '#0492C2' }}>
                    Estoy interesado en recibir más información sobre mentorías o programas para fortalecer mi estrategia digital.
                  </Label>
                </div>
              </div>


              <Button type="submit" className="w-full kamdata-button text-black font-bold text-lg py-6" style={{ backgroundColor: '#EBAC3F', borderRadius: '10px' }}>
                Iniciar Diagnóstico <ArrowRight className="ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default IntroStep;