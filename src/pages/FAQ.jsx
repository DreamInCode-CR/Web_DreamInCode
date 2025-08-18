import FAQAccordion from '../ui/FAQAccordion'

export default function FAQ(){
  const items = [
    { question: '¿Cómo contacto con soporte si tengo un problema?', answer: 'En la parte inferior de la página encontrarás el pie de página. Escríbenos a nuestro correo y nuestro equipo te ayudará lo antes posible.'},
    { question: '¿Cómo inicio sesión?', answer: 'Ve al apartado de login. Usa tu correo y contraseña.'},
    { question: '¿Cómo registro un usuario?', answer: 'Ve al apartado de registrarse. Completa el formulario y valida los campos.'},
    { question: '¿Puedo editar mis datos?', answer: 'Sí, desde la sección de perfil cuando ya hayas iniciado sesión.'},
  ]


  return (
    <div className="flex flex-col min-h-screen">
      {/* Contenido principal */}
      <main className="flex-grow text-white px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-10">Preguntas Frecuentes</h1>
        <FAQAccordion items={items} />
      </main>

    </div>
  );
}