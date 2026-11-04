package tecnm.equipo4.barberoApi.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.models.Servicio;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;
import tecnm.equipo4.barberoApi.repositories.ServicioRepository;
import tecnm.equipo4.barberoApi.repositories.TurnoRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final ClienteRepository clienteRepository;
    private final BarberoRepository barberoRepository;
    private final ServicioRepository servicioRepository;

    public List<Turno> listarTodos() {
        return (List<Turno>) turnoRepository.findAll();
    }

    public Optional<Turno> buscarPorId(Long idTurno) {
        return turnoRepository.findById(idTurno);
    }

    public List<Turno> listarPorFecha(String fecha) {
        return turnoRepository.findByFecha(fecha);
    }

    public List<Turno> listarPorEstado(String estado) {
        return turnoRepository.findByEstado(estado);
    }

    public List<Turno> listarPorBarbero(Long idBarbero) {
        return turnoRepository.findByBarbero_IdBarberoOrderByIdTurnoDesc(idBarbero);
    }

    public List<Turno> listarPorCliente(Long idCliente) {
        return turnoRepository.findByCliente_IdClienteOrderByIdTurnoDesc(idCliente);
    }


    public List<Turno> obtenerHorariosOcupados(Long idBarbero, String fecha) {
        return turnoRepository.findByBarbero_IdBarberoAndFechaAndEstadoNot(idBarbero, fecha, "CANCELADO");
    }

    public Turno agendar(Turno turno) {
        Long idClienteVal = (turno.getCliente() != null) ? turno.getCliente().getIdCliente() : null;
        if (idClienteVal != null) {
            Cliente clienteReal = clienteRepository.findById(idClienteVal)
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + idClienteVal));
            turno.setCliente(clienteReal);
        }

        Long idBarberoVal = (turno.getBarbero() != null) ? turno.getBarbero().getIdBarbero() : null;
        if (idBarberoVal != null) {
            Barbero barberoReal = barberoRepository.findById(idBarberoVal)
                    .orElseThrow(() -> new RuntimeException("Barbero no encontrado con ID: " + idBarberoVal));
            turno.setBarbero(barberoReal);
        }

        Long idServicioVal = (turno.getServicio() != null) ? turno.getServicio().getIdServicio() : null;
        if (idServicioVal != null) {
            Servicio servicioReal = servicioRepository.findById(idServicioVal)
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + idServicioVal));
            turno.setServicio(servicioReal);
        }

        return turnoRepository.save(turno);
    }

    public Optional<Turno> cambiarEstado(Long idTurno, String nuevoEstado) {
        return turnoRepository.findById(idTurno).map(t -> {
            t.setEstado(nuevoEstado);
            return turnoRepository.save(t);
        });
    }

    public void eliminar(Long idTurno) {
        turnoRepository.deleteById(idTurno);
    }
}