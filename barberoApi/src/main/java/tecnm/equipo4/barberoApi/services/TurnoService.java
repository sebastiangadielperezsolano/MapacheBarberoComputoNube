package tecnm.equipo4.barberoApi.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tecnm.equipo4.barberoApi.models.Barbero;
import tecnm.equipo4.barberoApi.models.Cliente;
import tecnm.equipo4.barberoApi.models.Servicio;
import tecnm.equipo4.barberoApi.models.Sucursal;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.repositories.BarberoRepository;
import tecnm.equipo4.barberoApi.repositories.ClienteRepository;
import tecnm.equipo4.barberoApi.repositories.ServicioRepository;
import tecnm.equipo4.barberoApi.repositories.SucursalRepository;
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
    private final SucursalRepository sucursalRepository;

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

    public List<Turno> listarPorSucursal(Long idSucursal) {
        return turnoRepository.findBySucursal_IdSucursal(idSucursal);
    }

    public List<Turno> obtenerHorariosOcupados(Long idBarbero, String fecha) {
        return turnoRepository.findByBarbero_IdBarberoAndFechaAndEstadoNot(idBarbero, fecha, "CANCELADO");
    }

    public Turno agendar(Turno turno) {
        if (turno.getCliente() != null && turno.getCliente().getIdCliente() != null) {
            Long idClienteVal = turno.getCliente().getIdCliente();
            Cliente clienteReal = clienteRepository.findById(idClienteVal)
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + idClienteVal));
            turno.setCliente(clienteReal);
        } else {
            throw new RuntimeException("El cliente es obligatorio para agendar un turno.");
        }

        if (turno.getBarbero() != null && turno.getBarbero().getIdBarbero() != null) {
            Long idBarberoVal = turno.getBarbero().getIdBarbero();
            Barbero barberoReal = barberoRepository.findById(idBarberoVal)
                    .orElseThrow(() -> new RuntimeException("Barbero no encontrado con ID: " + idBarberoVal));
            turno.setBarbero(barberoReal);
        } else {
            throw new RuntimeException("El barbero es obligatorio para agendar un turno.");
        }

        if (turno.getServicio() != null && turno.getServicio().getIdServicio() != null) {
            Long idServicioVal = turno.getServicio().getIdServicio();
            Servicio servicioReal = servicioRepository.findById(idServicioVal)
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + idServicioVal));
            turno.setServicio(servicioReal);
        } else {
            throw new RuntimeException("El servicio es obligatorio para agendar un turno.");
        }

        if (turno.getSucursal() != null && turno.getSucursal().getIdSucursal() != null) {
            Long idSucursalVal = turno.getSucursal().getIdSucursal();
            Sucursal sucursalReal = sucursalRepository.findById(idSucursalVal)
                    .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con ID: " + idSucursalVal));
            turno.setSucursal(sucursalReal);
        } else {
            throw new RuntimeException("La sucursal es obligatoria para agendar un turno.");
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