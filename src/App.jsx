import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import './App.css';
import { ListaUsuarios } from './components/ListaUsuarios/ListaUsuarios.jsx'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ2tmbGh3dWh5ZnJmdHFyaXlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NDg3Mzk0NywiZXhwIjoxOTYwNDQ5OTQ3fQ.dB-bsoKg2FX3pbMrIltUvA_oSUp1TZsyNHqZGWEAADQ';
const SUPABASE_URL = 'https://xagkflhwuhyfrftqriyr.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


function novosUsuariosLive(adicionaUsuario) {
  return supabaseClient
    .from('usuarios')
    .on('INSERT', (usuarioLive) => {
      adicionaUsuario(usuarioLive.new)
    })
    .subscribe();
}

function atualizaLista () {
  return supabaseClient
    .from('usuarios')
    .on('DELETE', () => {
      window.location.reload(false);
    })
    .on('UPDATE', () => {
      window.location.reload(false);
    })
}


export default function App() {
  const [usuario, setUsuario] = useState('')
  const [listaDeUsuarios, setListaDeUsuarios] = useState([])


  React.useEffect(() => {
    supabaseClient
      .from('usuarios')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        console.log('dados que vem do banco:', data)
        setListaDeUsuarios(data)
      })

    novosUsuariosLive((novoUsuario) => {
      setListaDeUsuarios((valorAtualDaLista) => {
        return [
          novoUsuario,
          ...valorAtualDaLista
        ]
      })
    });
    atualizaLista ();

  }, [])

  function handleNovoUsuario(novoUsuario) {
    supabaseClient
      .from('usuarios')
      .insert([{
        usuarios: novoUsuario
      }])
      .then((response) => {
        console.log('o que esta vindo de resposta do supabase', response)
        setUsuario('');
      })
  }


  return (
    <div className='app'>
      <div className='information-wrapper'>
        <form onSubmit={(event) => {
          event.preventDefault()
          handleNovoUsuario(usuario)
        }}>
          <input
            value={usuario}
            type="text"
            onChange={(event) => { setUsuario(event.target.value) }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleNovoUsuario(usuario)
              }
            }}
          />
          <input type="submit" value='Adicionar usuário' />
        </form>
      </div>
      <ListaUsuarios users={listaDeUsuarios} />
    </div>
  )
}