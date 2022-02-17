import React from 'react';
import { useState } from 'react';
import '../../../src/App.css'
import { createClient } from '@supabase/supabase-js';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ2tmbGh3dWh5ZnJmdHFyaXlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NDg3Mzk0NywiZXhwIjoxOTYwNDQ5OTQ3fQ.dB-bsoKg2FX3pbMrIltUvA_oSUp1TZsyNHqZGWEAADQ';
const SUPABASE_URL = 'https://xagkflhwuhyfrftqriyr.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export function ListaUsuarios({ users }) {
    const [mostrar, setMostrar] = useState(false)
    const [usuarioEditado, setUsuarioEditado] = useState('')

    function toggleEditButton() {
        setMostrar(!mostrar)
    }

    function deleteUser(user) {
        return supabaseClient
            .from('usuarios')
            .delete()
            .match({ id: user.id })
            .then((response) => { console.log('usuario deletado com sucesso ', response) })
    }

    function editUser(usuarioEditado) {
        return supabaseClient
            .from('usuarios')
            .update({usuarioEditado})
            .match({ id: users.id})
            .then((response) => { console.log('usuario editado com sucesso', response) })
    }

    return (
        <div>
            <ul>
                {users.map((user) => {
                    return (
                        <div key={user.id} className='listaDeUsuarios'>
                            <li key={user.id}>
                                {user.usuarios}
                                <div key={`editDelete${user.id}`} className='editDelete'>
                                    <button
                                        key={`buttonEditarUsuario${user.id}`}
                                        id={`edit${user.id}`}
                                        className='edit'
                                        onClick={() => { toggleEditButton() }}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        key={`buttonDeletarUsuario${user.id}`}
                                        id={`delete${user.id}`}
                                        className='delete'
                                        onClick={() => {
                                            deleteUser(user)
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>

                                <form key={user.id}
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                    }}
                                >
                                    {mostrar ?
                                        <input
                                            type='text'
                                            key={`textInputEditarUsuario${user.id}`}
                                            id={user.id}
                                            onChange={(event) => {
                                                event.preventDefault()
                                                setUsuarioEditado(event.target.value)
                                            }} />
                                        : ''}
                                    {mostrar ? <input
                                        onClick={() => {
                                            editUser(usuarioEditado)
                                        }}
                                        type='submit'
                                        value='Editar'
                                        key={`confirmarEditarUsuario${user.id}`} /> : ''}
                                </form>
                            </li>
                        </div>
                    )
                })}
            </ul>
        </div>
    )
}